import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { Coupon } from "@/models/Coupon";
import { getServerSession } from "@/lib/auth/session";
import { sendEmail } from "@/lib/email/mailer";
import { getOrderConfirmationEmail, getNewOrderAdminNotificationEmail } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const { items, customer, shippingAddress, paymentMethod, couponCode } = await req.json();

    if (!items || !items.length || !customer || !shippingAddress || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: "Missing required order information" },
        { status: 400 }
      );
    }

    if (!customer.fullName || !customer.email || !customer.phone) {
      return NextResponse.json(
        { success: false, message: "Full customer contact details are required" },
        { status: 400 }
      );
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return NextResponse.json(
        { success: false, message: "Complete shipping address is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const session = await getServerSession();

    // 1. Fetch products and calculate server-side subtotal & verify stock
    const verifiedItems: any[] = [];
    let subtotal = 0;

    for (const item of items) {
      const prod = await Product.findById(item.productId);
      if (!prod || !prod.isActive) {
        return NextResponse.json(
          { success: false, message: `Product not available: ${item.name || item.productId}` },
          { status: 400 }
        );
      }

      if (prod.stock < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for ${prod.name}. Available: ${prod.stock}`,
          },
          { status: 400 }
        );
      }

      const unitPrice = prod.salePrice ?? prod.price;
      subtotal += unitPrice * item.quantity;

      verifiedItems.push({
        product: prod._id,
        name: prod.name,
        price: unitPrice,
        quantity: item.quantity,
        image: prod.thumbnail,
        sku: prod.sku,
      });
    }

    // 2. Validate and calculate coupon discount
    let discount = 0;
    let validatedCouponCode: string | undefined = undefined;

    if (couponCode) {
      const codeUpper = couponCode.toUpperCase().trim();
      const coupon = await Coupon.findOne({ code: codeUpper, isActive: true });
      if (coupon) {
        if (coupon.discountType === "PERCENTAGE") {
          discount = Math.round((subtotal * coupon.discountValue) / 100);
          if (coupon.maximumDiscountAmount && discount > coupon.maximumDiscountAmount) {
            discount = coupon.maximumDiscountAmount;
          }
        } else {
          discount = Math.min(coupon.discountValue, subtotal);
        }
        validatedCouponCode = coupon.code;
        // Increment usage
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usageCount: 1 } });
      } else if (codeUpper === "GLOW15") {
        // Fallback default coupon
        discount = Math.round((subtotal * 15) / 100);
        validatedCouponCode = "GLOW15";
      }
    }

    // 3. Shipping fee calculation
    const afterDiscount = Math.max(0, subtotal - discount);
    const shipping = afterDiscount >= 999 ? 0 : 99;
    const tax = 0; // Tax included
    const total = afterDiscount + shipping;

    // 4. Generate order number
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `VB-${timestamp}-${random}`;

    // 5. Decrement inventory
    for (const item of verifiedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // 6. Create Order record
    const order = await Order.create({
      orderNumber,
      user: session?.userId || undefined,
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.toLowerCase().trim(),
        phone: customer.phone.trim(),
      },
      items: verifiedItems,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      couponCode: validatedCouponCode,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
      orderStatus: "CONFIRMED",
      shippingAddress: {
        fullName: shippingAddress.fullName || customer.fullName,
        phone: shippingAddress.phone || customer.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country || "India",
      },
      statusHistory: [
        {
          status: "CONFIRMED",
          timestamp: new Date(),
          note: "Order placed successfully",
        },
      ],
    });

    // 7. Send Order Confirmation Email to Customer (non-blocking)
    const emailData = getOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customer: { fullName: order.customer.fullName },
      items: verifiedItems,
      total: order.total,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
    });

    sendEmail({
      to: order.customer.email,
      subject: emailData.subject,
      html: emailData.html,
    }).catch((err) => console.error("Order confirmation email error:", err));

    // 8. Send New Order Alert Email to Admin (shvm489@gmail.com)
    const adminEmailAddress = process.env.ADMIN_EMAIL || "shvm489@gmail.com";
    const adminOrderData = getNewOrderAdminNotificationEmail({
      orderNumber: order.orderNumber,
      customer: order.customer,
      items: verifiedItems,
      total: order.total,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
    });

    sendEmail({
      to: adminEmailAddress,
      subject: adminOrderData.subject,
      html: adminOrderData.html,
      replyTo: order.customer.email,
    }).catch((err) => console.error("Admin order notification email error:", err));

    return NextResponse.json({
      success: true,
      message: "Order placed successfully!",
      orderNumber: order.orderNumber,
      orderId: order._id.toString(),
    });
  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to place order. Please try again." },
      { status: 500 }
    );
  }
}
