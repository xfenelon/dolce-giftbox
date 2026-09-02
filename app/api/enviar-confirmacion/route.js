import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function formatMoney(n) {
  return `$${Number(n).toLocaleString("es-CO")}`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      orderId,
      senderEmail,
      senderName,
      senderPhone,
      recipientName,
      city,
      neighborhood,
      address,
      deliveryDate,
      items,
      subtotal,
      shippingCost,
      total,
    } = body;

    if (!senderEmail || !orderId) {
      return Response.json({ error: "Falta orderId o senderEmail" }, { status: 400 });
    }

    const itemsHtml = (items || [])
      .map(
        (i) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #EFE6DC;font-family:Georgia,serif;color:#4A3A2C;">
            ${i.name}${i.ribbon ? ` · Listón: ${i.ribbon}` : ""}${i.variant ? ` · ${i.variant}` : ""}
            <br/><span style="color:#927A5D;font-size:13px;">Cantidad: ${i.qty}</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #EFE6DC;text-align:right;font-family:Georgia,serif;color:#4A3A2C;white-space:nowrap;">
            ${formatMoney(i.price * i.qty)}
          </td>
        </tr>`
      )
      .join("");

    const html = `
    <div style="background:#F4EAE1;padding:32px 16px;font-family:Georgia,serif;">
      <div style="max-width:520px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;">
        
        <div style="background:#927A5D;padding:28px 32px;text-align:center;">
          <h1 style="color:#FFFFFF;font-size:22px;font-weight:400;margin:0;letter-spacing:1px;">Dolce Giftbox</h1>
        </div>

        <div style="padding:32px;">
          <p style="color:#4A3A2C;font-size:16px;margin:0 0 6px;">¡Gracias por tu pedido, ${senderName || ""}! 🎁</p>
          <p style="color:#927A5D;font-size:13.5px;margin:0 0 24px;">Ya lo recibimos y lo estamos preparando con cariño.</p>

          <div style="background:#F4E2DF;border-radius:12px;padding:18px 20px;margin-bottom:24px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="font-size:13px;color:#927A5D;padding-bottom:4px;">Número de pedido</td>
                <td style="font-size:13px;color:#927A5D;padding-bottom:4px;text-align:right;">Celular de contacto</td>
              </tr>
              <tr>
                <td style="font-size:20px;color:#4A3A2C;font-weight:bold;">#${orderId}</td>
                <td style="font-size:20px;color:#4A3A2C;font-weight:bold;text-align:right;">${senderPhone || "—"}</td>
              </tr>
            </table>
          </div>

          <p style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#4A3A2C;margin:0 0 12px;">Tu pedido</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:8px;">
            ${itemsHtml}
          </table>

          <table style="width:100%;border-collapse:collapse;margin-top:10px;">
            <tr>
              <td style="padding:4px 0;font-size:13.5px;color:#927A5D;">Subtotal</td>
              <td style="padding:4px 0;font-size:13.5px;color:#927A5D;text-align:right;">${formatMoney(subtotal)}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13.5px;color:#927A5D;">Envío</td>
              <td style="padding:4px 0;font-size:13.5px;color:#927A5D;text-align:right;">${shippingCost === 0 ? "Gratis" : formatMoney(shippingCost)}</td>
            </tr>
            <tr>
              <td style="padding:12px 0 0;font-size:16px;color:#4A3A2C;border-top:1px solid #EFE6DC;">Total</td>
              <td style="padding:12px 0 0;font-size:16px;color:#4A3A2C;border-top:1px solid #EFE6DC;text-align:right;font-weight:bold;">${formatMoney(total)}</td>
            </tr>
          </table>

          <p style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#4A3A2C;margin:28px 0 12px;">Entrega</p>
          <p style="font-size:14px;color:#4A3A2C;margin:0 0 4px;">${recipientName ? `Para: ${recipientName}` : ""}</p>
          <p style="font-size:14px;color:#4A3A2C;margin:0 0 4px;">${address || ""}${neighborhood ? `, ${neighborhood}` : ""}${city ? `, ${city}` : ""}</p>
          <p style="font-size:14px;color:#4A3A2C;margin:0 0 4px;">${deliveryDate ? `Fecha estimada: ${formatDate(deliveryDate)}` : ""}</p>
          <p style="font-size:12.5px;color:#927A5D;margin:6px 0 0;">Entrega entre las 7:00 a.m. y las 12:00 p.m.</p>

          <div style="text-align:center;margin-top:32px;">
            <a href="https://dolcegiftbox.com/rastrear-pedido" style="display:inline-block;background:#927A5D;color:#FFFFFF;padding:13px 30px;border-radius:999px;text-decoration:none;font-family:Georgia,serif;font-size:14px;">
              Rastrear mi pedido
            </a>
          </div>
        </div>

        <div style="background:#F4EAE1;padding:18px 32px;text-align:center;">
          <p style="font-size:12px;color:#927A5D;margin:0;">Dolce Giftbox · dolcegiftbox.com</p>
        </div>
      </div>
    </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Dolce Giftbox <pedidos@dolcegiftbox.com>",
      to: senderEmail,
      subject: `Confirmación de tu pedido #${orderId} 🎁`,
      html,
    });

    if (error) {
      console.error("Error enviando correo con Resend:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Error en /api/enviar-confirmacion:", err);
    return Response.json({ error: err.message || "Error desconocido" }, { status: 500 });
  }
}