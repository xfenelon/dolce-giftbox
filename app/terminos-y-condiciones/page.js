"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CartDrawer from "../components/CartDrawer";
import CartToast from "../components/CartToast";
import SearchOverlay from "../components/SearchOverlay";
import { useCart } from "../context/CartContext";
import { CATEGORIES } from "../data/products";
import {
  ShoppingBag, Menu, X, Search, User, MessageCircle, AtSign, ChevronDown,
} from "lucide-react";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Marcellus&display=swap');";

const CONTENT = [
  { type: "h2", text: "Aviso legal" },
  { type: "p", text: "Gracias por visitar el sitio web de Dolce." },
  { type: "p", text: "El presente sitio web es propiedad de María Fernanda Arango Trespalacios, identificada con NIT 1.152.470.760-8, quien actúa como titular y responsable de la marca comercial Dolce, dedicada al diseño, elaboración y comercialización de regalos, detalles y experiencias personalizadas, con cobertura de envíos a todo el territorio colombiano." },
  { type: "p", text: "Para efectos de los presentes Términos y Condiciones de Uso (en adelante, los \"Términos y Condiciones\"), se entenderá por \"Dolce\" la marca comercial bajo la cual se ofrecen los productos y servicios disponibles en este sitio web." },
  { type: "p", text: "Al acceder, navegar o realizar una compra a través de este sitio web, el usuario declara haber leído, comprendido y aceptado los presentes Términos y Condiciones." },
  { type: "p", text: "Dolce tiene como propósito brindar una experiencia de compra segura, transparente y satisfactoria para todos sus clientes, razón por la cual establece las siguientes condiciones de uso." },

  { type: "h2", text: "1. Objeto" },
  { type: "p", text: "Los presentes Términos y Condiciones regulan el acceso, navegación y uso del sitio web de Dolce, así como la relación comercial derivada de la compra de los productos ofrecidos a través de este sitio web, WhatsApp, Instagram, TikTok, Facebook y demás canales oficiales de comunicación (en adelante, los \"Canales Digitales\")." },
  { type: "p", text: "Estos Términos y Condiciones aplican a todos los usuarios, clientes y visitantes que interactúen con Dolce a través de cualquiera de sus Canales Digitales." },

  { type: "h2", text: "2. Aceptación de los Términos y Condiciones" },
  { type: "p", text: "Al acceder, navegar o realizar una compra a través del sitio web o de cualquiera de los Canales Digitales de Dolce, el usuario declara haber leído, comprendido y aceptado de manera libre e inequívoca los presentes Términos y Condiciones." },
  { type: "p", text: "Si el usuario no está de acuerdo con cualquiera de las disposiciones aquí establecidas, deberá abstenerse de utilizar el sitio web o de realizar pedidos por cualquiera de los Canales Digitales de Dolce." },
  { type: "p", text: "Se recomienda leer cuidadosamente estos Términos y Condiciones antes de efectuar cualquier compra." },
  { type: "p", text: "Al aceptar estos Términos y Condiciones, el usuario declara ser mayor de edad o contar con la autorización de su representante legal para realizar compras a través de los Canales Digitales de Dolce." },
  { type: "p", text: "Dolce se reserva el derecho de modificar, actualizar o complementar los presentes Términos y Condiciones en cualquier momento y sin previo aviso. Las modificaciones entrarán en vigencia desde su publicación en el sitio web, por lo que se recomienda a los usuarios revisarlos periódicamente." },
  { type: "p", text: "Toda nueva funcionalidad, producto, servicio o herramienta que sea incorporada al sitio web o a los Canales Digitales de Dolce también estará sujeta a estos Términos y Condiciones." },

  { type: "h2", text: "3. Derechos de propiedad intelectual e industrial" },
  { type: "p", text: "La marca Dolce, su nombre comercial, logotipo, identidad visual, diseños, ilustraciones, fotografías, videos, textos, composiciones gráficas, material publicitario, contenido digital y demás signos distintivos publicados en este sitio web o en cualquiera de los Canales Digitales son propiedad de María Fernanda Arango Trespalacios o se utilizan con la autorización de sus respectivos titulares." },
  { type: "p", text: "Ningún contenido publicado en este sitio web podrá interpretarse como una autorización, licencia o cesión de derechos sobre la propiedad intelectual o industrial de Dolce o de terceros." },
  { type: "p", text: "Queda prohibida la reproducción, distribución, modificación, publicación, comercialización, extracción, copia o cualquier otro uso total o parcial del contenido sin la autorización previa y por escrito de su titular." },
  { type: "p", text: "Cualquier uso no autorizado podrá dar lugar a las acciones legales correspondientes, de conformidad con la legislación colombiana vigente sobre propiedad intelectual e industrial." },

  { type: "h2", text: "4. Derechos de autor" },
  { type: "p", text: "Todo el contenido disponible en este sitio web y en los Canales Digitales de Dolce, incluyendo, entre otros, fotografías, imágenes, videos, diseños, ilustraciones, textos, descripciones de productos, logotipos, gráficos, material audiovisual, material publicitario, catálogos, bases de datos y cualquier otro contenido digital, se encuentra protegido por las normas nacionales e internacionales sobre derechos de autor." },
  { type: "p", text: "Los usuarios podrán acceder al contenido únicamente para fines personales e informativos relacionados con la navegación y compra de los productos ofrecidos por Dolce." },
  { type: "p", text: "Queda expresamente prohibida la reproducción, copia, adaptación, modificación, distribución, publicación, comercialización o cualquier otra forma de explotación del contenido, total o parcial, sin la autorización previa y escrita de su titular." },
  { type: "p", text: "El uso indebido del contenido podrá constituir una infracción a la legislación sobre derechos de autor y dará lugar a las acciones legales que correspondan." },
  { type: "p", text: "Las fotografías de los productos, ilustraciones, diseños de tarjetas, empaques, composiciones, material gráfico y demás contenido creativo desarrollado por Dolce constituyen obras protegidas por derechos de autor. Su reproducción, utilización o adaptación sin autorización expresa de su titular está prohibida." },

  { type: "h2", text: "5. Protección de datos personales" },
  { type: "p", text: "Dolce, cuyo titular es María Fernanda Arango Trespalacios, reconoce la importancia de la privacidad y la protección de los datos personales de sus usuarios, clientes, proveedores y demás personas que interactúan con el sitio web o con cualquiera de sus Canales Digitales." },
  { type: "p", text: "Los datos personales suministrados por los usuarios serán tratados de conformidad con la Ley 1581 de 2012, el Decreto 1074 de 2015 y las demás normas colombianas que regulan la protección de datos personales." },
  { type: "p", text: "La información recolectada será utilizada únicamente para fines relacionados con la gestión de pedidos, atención al cliente, procesamiento de pagos, coordinación de envíos, envío de información comercial cuando exista autorización del titular y el cumplimiento de obligaciones legales y contractuales." },
  { type: "p", text: "Dolce implementa medidas razonables de seguridad para proteger la información personal contra el acceso, uso, alteración o divulgación no autorizada." },
  { type: "p", text: "El tratamiento de los datos personales se realizará conforme a la Política de Tratamiento de Datos Personales de Dolce, la cual se encuentra disponible para consulta en este sitio web." },
  { type: "p", text: "Los titulares de la información podrán ejercer en cualquier momento sus derechos de conocer, actualizar, rectificar, solicitar la supresión de sus datos, revocar la autorización otorgada y presentar consultas o reclamos, mediante los canales de contacto publicados en este sitio web." },

  { type: "h2", text: "6. ¿Dónde hacemos entregas?" },
  { type: "p", text: "6.1. Dolce realiza envíos a todo el territorio colombiano." },
  { type: "p", text: "Las entregas dentro del área metropolitana de Medellín se realizarán en la fecha acordada con el cliente al momento de confirmar el pedido, siempre que se cumplan los tiempos mínimos de producción y las condiciones operativas." },
  { type: "p", text: "Los envíos con destino a ciudades o municipios fuera del área metropolitana de Medellín se efectuarán a través de la transportadora Interrapidísimo o la empresa transportadora que Dolce determine. En estos casos, la fecha estimada de entrega dependerá exclusivamente de los tiempos logísticos y operativos de la transportadora, por lo que Dolce no garantiza la entrega en una fecha específica solicitada por el cliente." },
  { type: "p", text: "Una vez el pedido sea entregado a la transportadora, los tiempos de tránsito, posibles retrasos ocasionados por condiciones climáticas, novedades logísticas, alta demanda, restricciones de movilidad o cualquier otra circunstancia ajena a Dolce serán responsabilidad de la empresa transportadora." },
  { type: "p", text: "Dolce proporcionará al cliente, cuando esté disponible, el número de guía correspondiente para que pueda realizar el seguimiento de su envío." },
  { type: "p", text: "Dolce no se hace responsable por retrasos en la entrega ocasionados por la transportadora, ni por daños derivados de una manipulación inadecuada del paquete una vez este haya sido recibido por la empresa transportadora, salvo que dichos daños sean atribuibles a un empaque deficiente por parte de Dolce." },
  { type: "p", text: "6.2. Para los envíos nacionales, el cliente deberá realizar su pedido con la suficiente anticipación, especialmente cuando se trate de fechas especiales como San Valentín, Día de la Madre, Día del Padre, Amor y Amistad, Navidad u otras temporadas de alta demanda, ya que los tiempos de entrega pueden variar debido a la operación de la transportadora." },

  { type: "h2", text: "7. ¿Cómo se realizan las entregas de los pedidos?" },
  { type: "p", text: "Dolce ha establecido las siguientes condiciones para garantizar el adecuado procesamiento, despacho y entrega de los pedidos:" },
  { type: "p", text: "7.1. Todos los pedidos serán preparados y despachados únicamente una vez el pago haya sido recibido y confirmado. En caso de realizarse el pago mediante plataformas o entidades financieras que requieran validación, el pedido será procesado únicamente cuando el pago figure como aprobado." },
  { type: "p", text: "7.2. Dolce no realiza envíos bajo la modalidad de contra entrega. Todos los pedidos deberán encontrarse pagados en su totalidad antes de iniciar su producción o despacho." },
  { type: "p", text: "7.3. Para entregas dentro del área metropolitana de Medellín, Dolce coordinará la fecha de entrega previamente con el cliente. No obstante, por razones operativas, de movilidad, condiciones climáticas u otras circunstancias ajenas a Dolce, no se garantiza una hora exacta de entrega." },
  { type: "p", text: "7.4. Para envíos nacionales realizados mediante Interrapidísimo u otra empresa transportadora seleccionada por Dolce, la fecha de entrega dependerá exclusivamente de los tiempos logísticos de la transportadora. En consecuencia, Dolce no garantiza la entrega en una fecha u horario específico solicitado por el cliente." },
  { type: "p", text: "7.5. Es responsabilidad del cliente suministrar correctamente la información de entrega, incluyendo nombre del destinatario, dirección completa, ciudad, barrio, número de contacto y cualquier otra información necesaria para facilitar la entrega. Dolce no será responsable por retrasos, devoluciones o costos adicionales ocasionados por errores en la información suministrada por el cliente." },
  { type: "p", text: "7.6. Los horarios de entrega son estimados y podrán variar por causas ajenas a Dolce, tales como condiciones climáticas, cierres viales, restricciones de movilidad, temporadas de alta demanda, novedades logísticas o cualquier otra situación atribuible a la empresa transportadora o a terceros." },
  { type: "p", text: "7.7. Una vez el pedido sea entregado a la empresa transportadora, Dolce enviará al cliente el número de guía correspondiente, cuando este se encuentre disponible, para que pueda realizar el seguimiento de su envío." },
  { type: "p", text: "7.8. Si la empresa transportadora devuelve el pedido debido a información incorrecta, ausencia del destinatario, imposibilidad de entrega o cualquier otra causa no atribuible a Dolce, el cliente deberá asumir los costos correspondientes al nuevo envío." },
  { type: "p", text: "7.9. En caso de que el destinatario rechace el pedido sin que exista una causa imputable a Dolce, el pedido será considerado como entregado y no procederá el reembolso del valor pagado." },
  { type: "p", text: "7.10. En fechas especiales como San Valentín, Día de la Madre, Día del Padre, Amor y Amistad, Navidad u otras temporadas de alta demanda, los tiempos de producción y entrega podrán incrementarse debido al volumen de pedidos y a la capacidad operativa de las empresas transportadoras." },
  { type: "p", text: "7.11. Los domiciliarios de Dolce tienen un tiempo de espera máximo de 10 minutos para establecer contacto con la persona que recibirá el producto." },
  { type: "p", text: "7.12. En caso de no poder realizar la entrega en un primer intento, el domiciliario seguirá entregando los pedidos que tiene en su plan de rutas de entrega. Al finalizar, el domiciliario se contactará nuevamente con el cliente o el consumidor para confirmar la dirección y concretar la entrega. Lo anterior trae consigo un recargo de $15.000 (quince mil pesos M/CTE) que deberá ser cancelado por el cliente a través del medio de pago indicado por Dolce antes de programar el nuevo intento de entrega, enviando el respectivo comprobante al canal de WhatsApp +57 311 329 0390." },
  { type: "p", text: "7.13. En caso de que no sea posible contactarse de manera telefónica con el destinatario final y se cuente con información exacta del conjunto residencial, torre y casa o apartamento, el cliente acepta que el pedido sea entregado en la portería del edificio o conjunto residencial." },

  { type: "h2", text: "8. Cancelación de pedidos" },
  { type: "p", text: "En caso de que el cliente desee cancelar un pedido, deberá comunicarlo a Dolce con una antelación mínima de 26 horas respecto a la fecha programada de entrega." },
  { type: "p", text: "Debido a que la mayoría de los productos comercializados por Dolce son personalizados o elaborados por encargo, no procederá el reembolso del dinero una vez iniciado el proceso de producción, personalización o adquisición de los productos necesarios para el pedido." },
  { type: "p", text: "En los casos en que la cancelación sea informada oportunamente y el pedido no haya iniciado su proceso de elaboración, Dolce podrá, a su discreción, ofrecer la reprogramación de la entrega o un saldo a favor para una futura compra." },

  { type: "h2", text: "9. Garantía de los productos" },
  { type: "p", text: "En Dolce, cada pedido es preparado, revisado y empacado cuidadosamente antes de ser despachado, con el fin de garantizar que el cliente reciba los productos en óptimas condiciones." },
  { type: "p", text: "Todos los productos son inspeccionados antes de su envío para verificar que correspondan a la referencia adquirida y que cumplan con los estándares de calidad establecidos por Dolce." },
  { type: "p", text: "Cuando los productos comercializados cuenten con garantía otorgada por su fabricante, esta será aplicable bajo las condiciones establecidas por dicho fabricante y conforme a la legislación colombiana vigente." },
  { type: "p", text: "En caso de que un producto presente defectos de fabricación o llegue con daños atribuibles al proceso de preparación o empaque realizado por Dolce, el cliente podrá solicitar la revisión de la garantía dentro de los tiempos establecidos en la política de garantías de Dolce y en la legislación colombiana aplicable." },
  { type: "p", text: "Los productos elaborados o personalizados conforme a las especificaciones del cliente no podrán ser objeto de garantía cuando el inconveniente corresponda a decisiones de diseño, colores, textos, imágenes o demás características previamente aprobadas por el cliente." },

  { type: "h2", text: "10. Cambios, devoluciones y reembolsos" },
  { type: "p", text: "Si el cliente considera que existe algún inconveniente con su pedido, deberá comunicarse con Dolce dentro de las primeras 24 horas siguientes a la entrega, indicando el número del pedido, una descripción de la novedad y adjuntando fotografías y/o videos que permitan evidenciar la situación presentada." },
  { type: "p", text: "Procederá el cambio, reposición o devolución del producto cuando:" },
  { type: "ul", items: [
    "El producto entregado no corresponda al solicitado por el cliente.",
    "El producto presente defectos de fabricación.",
    "El pedido llegue con daños atribuibles al proceso de preparación o empaque realizado por Dolce.",
  ]},
  { type: "p", text: "No procederán cambios, devoluciones o reembolsos cuando:" },
  { type: "ul", items: [
    "El producto haya sido elaborado o personalizado de acuerdo con las especificaciones aprobadas por el cliente.",
    "Existan ligeras variaciones en colores, tamaños, flores, empaques o elementos decorativos propias de productos artesanales o de la disponibilidad de inventario, siempre que no alteren significativamente el diseño o funcionalidad del producto.",
    "El deterioro sea consecuencia de un uso inadecuado, almacenamiento incorrecto o manipulación posterior a la entrega.",
    "Se trate de productos perecederos cuyo estado se haya visto afectado después de la entrega al destinatario.",
  ]},
  { type: "p", text: "Cuando una devolución sea procedente, el producto deberá encontrarse en las mismas condiciones en las que fue entregado, sin señales de uso indebido, alteración o manipulación, salvo que la devolución obedezca a un defecto de fabricación o daño imputable a Dolce." },
  { type: "p", text: "En caso de aprobarse un reembolso, este se realizará utilizando el mismo medio de pago empleado por el cliente o mediante el mecanismo que las partes acuerden, dentro de los plazos previstos en la legislación colombiana." },
  { type: "p", text: "Los productos personalizados, elaborados conforme a las instrucciones del cliente (como mensajes, nombres, fotografías, colores, diseños, composiciones o cualquier otra personalización), no estarán sujetos al derecho de retracto ni a cambios por motivos de gusto o decisión del cliente, de conformidad con lo previsto en el artículo 47 de la Ley 1480 de 2011, salvo que presenten defectos de calidad o no correspondan a las especificaciones solicitadas." },
  { type: "p", text: "Dolce se reserva el derecho de verificar el estado del producto antes de aprobar cualquier cambio, reposición o reembolso." },

  { type: "h2", text: "11. Disponibilidad de los productos" },
  { type: "p", text: "Dolce procura mantener actualizada la disponibilidad de los productos publicados en el sitio web. Sin embargo, debido a la rotación de inventario, la disponibilidad de proveedores y la naturaleza artesanal de algunos productos, es posible que determinadas referencias o elementos no se encuentren disponibles al momento de procesar el pedido." },
  { type: "p", text: "En caso de presentarse esta situación, Dolce informará oportunamente al cliente mediante los datos de contacto suministrados durante la compra, con el fin de ofrecer alguna de las siguientes alternativas: sustitución por un producto o elemento de características, calidad y valor similares; modificación del pedido con aprobación previa del cliente; o reembolso del valor correspondiente cuando no sea posible ofrecer una alternativa satisfactoria." },
  { type: "p", text: "En productos que incluyan flores naturales, alimentos, chocolates, bebidas, empaques, accesorios o elementos decorativos, Dolce podrá realizar sustituciones por referencias de igual o superior calidad cuando, por causas ajenas a su voluntad, alguno de los componentes no se encuentre disponible. Estas sustituciones conservarán, en la medida de lo posible, el diseño, estilo y valor del regalo adquirido." },
  { type: "p", text: "Dolce podrá sustituir marcas, presentaciones, referencias, colores o elementos decorativos cuando ello sea necesario por razones de disponibilidad, procurando conservar la calidad, funcionalidad, estilo y valor del regalo adquirido." },

  { type: "h2", text: "12. Limitación de responsabilidad" },
  { type: "p", text: "Dolce no será responsable por retrasos, incumplimientos o imposibilidad de ejecución derivados de circunstancias de fuerza mayor o caso fortuito, incluyendo, entre otros, desastres naturales, cierres viales, manifestaciones, accidentes, fallas en los servicios públicos, problemas de transporte, decisiones de autoridades competentes, conflictos laborales o cualquier otra situación fuera de su control razonable." },

  { type: "h2", text: "13. Contacto" },
  { type: "p", text: "Para cualquier consulta, solicitud, petición, queja, reclamo, garantía o información relacionada con los productos y servicios ofrecidos por Dolce, los usuarios podrán comunicarse a través de los siguientes canales oficiales de atención:" },
  { type: "ul", items: [
    "Titular: María Fernanda Arango Trespalacios",
    "Correo electrónico: dolcegiftboxcolombia@gmail.com",
    "WhatsApp: +57 311 329 0390",
    "Instagram: @dolcegiftbox",
    "Cobertura: envíos a todo Colombia.",
  ]},
  { type: "p", text: "Toda comunicación recibida será atendida dentro de un tiempo razonable, conforme al volumen de solicitudes y a los horarios de atención de Dolce." },
];

function LegalBlocks({ blocks }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
        if (b.type === "ul") {
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{b.text}</p>;
      })}
    </>
  );
}

export default function TerminosYCondicionesPage() {
  const [dudasOpen, setDudasOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalCount } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="dolce-root">
      <style>{`
        ${FONT_IMPORT}
        .dolce-root {
          --white:#FFFFFF; --cream:#F4EAE1; --blush:#F4E2DF; --tan:#CEBAA7; --taupe:#BBA083; --olive:#927A5D; --ink:#4A3A2C;
          background: var(--white); color: var(--olive); font-family:'Marcellus', serif; overflow-x:hidden;
        }
        .dolce-root * { box-sizing: border-box; }

        .announce { background: var(--blush); text-align:center; padding: 9px 16px; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--olive); }

        .navbar { position: sticky; top:0; z-index:40; display:flex; align-items:center; justify-content:space-between;
          padding: 18px 6vw; background: rgba(255,255,255,0.94); backdrop-filter: blur(8px);
          border-bottom: 1px solid transparent; transition: box-shadow .3s, padding .3s, border-color .3s; }
        .navbar.scrolled { box-shadow: 0 6px 20px rgba(74,58,44,0.08); border-color: var(--tan); padding: 10px 6vw; }
        .navbar-left { display:flex; align-items:center; gap: 48px; }
        .brand-logo-img { height: 56px; width: auto; display: block; }
        .nav-links { display:flex; gap: 32px; list-style:none; margin:0; padding:0; }
        .nav-links li { font-size: 13px; cursor:pointer; position:relative; padding-bottom:4px; color: var(--olive); text-transform: uppercase; letter-spacing: 0.5px; }
        .nav-dropdown { position: relative; }
        .nav-dropdown span { cursor: pointer; }
        .dropdown-menu { position: absolute; top: 100%; left: 0; background: var(--white); border: 1px solid var(--tan);
          border-radius: 10px; box-shadow: 0 12px 30px rgba(74,58,44,0.12); padding: 10px 0; min-width: 220px;
          display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(6px);
          transition: opacity .2s, transform .2s, visibility .2s; z-index: 50; }
        .nav-dropdown:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-menu a { padding: 9px 20px; font-size: 13px; text-transform: none; letter-spacing: 0; color: var(--olive); text-decoration:none; white-space: nowrap; }
        .dropdown-menu a:hover { background: var(--cream); }
        .dropdown-all { border-top: 1px solid var(--tan); margin-top: 6px; padding-top: 12px !important; }
        .nav-links li::after { content:''; position:absolute; left:0; bottom:0; width:0; height:1px; background:var(--olive); transition:width .3s; }
        .nav-links li:hover::after { width:100%; }
        .nav-links a, .footer-nav a { color: inherit; text-decoration: none; }
        .nav-dropdown { position: relative; }
        .dropdown-menu { position: absolute; top: 100%; left: 0; background: var(--white); border: 1px solid var(--tan);
          border-radius: 10px; box-shadow: 0 12px 30px rgba(74,58,44,0.12); padding: 10px 0; min-width: 220px;
          display: flex; flex-direction: column; opacity: 0; visibility: hidden; transform: translateY(6px);
          transition: opacity .2s, transform .2s, visibility .2s; z-index: 50; }
        .nav-dropdown:hover .dropdown-menu { opacity: 1; visibility: visible; transform: translateY(0); }
        .dropdown-menu a { padding: 9px 20px; font-size: 13px; text-transform: none; letter-spacing: 0; color: var(--olive); text-decoration:none; white-space: nowrap; }
        .dropdown-menu a:hover { background: var(--cream); }
        .dropdown-all { border-top: 1px solid var(--tan); margin-top: 6px; padding-top: 12px !important; }
        .nav-icons { display:flex; align-items:center; gap: 18px; }
        .icon-btn { background:none; border:none; cursor:pointer; color:var(--olive); position:relative; }
        .cart-badge { position:absolute; top:-8px; right:-9px; background:var(--olive); color:var(--white); font-size:10px;
          width:16px; height:16px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
        .menu-toggle { display:none; background:none; border:none; cursor:pointer; color:var(--olive); }
        .mobile-menu { position:fixed; inset:0; background:var(--white); z-index:60; display:flex; flex-direction:column;
          align-items:center; justify-content:center; padding: 40px 8vw; }
        .mobile-menu-logo { height: 44px; width: auto; display:block; margin-bottom: 36px; }
        .mobile-menu ul { list-style:none; margin:0; padding:0; width: 100%; max-width: 320px; }
        .mobile-menu li { font-family:'Marcellus'; font-size: 17px; color:var(--olive); text-align:center;
          padding: 17px 0; border-bottom: 1px solid var(--cream); text-transform: uppercase; letter-spacing: 0.5px; }
        .mobile-dudas { display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; }
        .mobile-dudas-icon { transition: transform .25s; }
        .mobile-dudas-icon.open { transform: rotate(180deg); }
        .mobile-sublink { font-size: 14px !important; opacity: .75; }
        .mobile-menu a { color: inherit; text-decoration: none; }
        .mobile-close { position:absolute; top:24px; right:6vw; background:none; border:none; cursor:pointer; color:var(--olive); }

        .page-header { padding: 46px 6vw 10px; text-align:center; }
        .breadcrumbs { font-size: 12.5px; color: var(--taupe); margin-bottom: 14px; }
        .breadcrumbs .active { color: var(--olive); }
        .breadcrumbs a { color: var(--taupe); text-decoration: none; }
        .page-header h1 { font-size: 28px; font-weight: 400; color: var(--olive); margin: 0 0 8px; }
        .page-header p { font-size: 13px; color: var(--taupe); }

        .legal-wrap { max-width: 760px; margin: 20px auto 0; padding: 0 6vw 80px; }
        .legal-wrap h2 { font-size: 18px; font-weight: 400; color: var(--ink); margin: 34px 0 12px; }
        .legal-wrap p { font-size: 14px; line-height: 1.8; color: var(--olive); opacity: .92; margin: 0 0 14px; }
        .legal-wrap ul { margin: 0 0 14px; padding-left: 20px; }
        .legal-wrap li { font-size: 14px; line-height: 1.8; color: var(--olive); opacity: .92; margin-bottom: 6px; }

        .footer { background: var(--blush); color: var(--olive); padding: 50px 6vw 26px; text-align:center; }
        .footer-icon { margin-bottom: 26px; display:flex; justify-content:center; color: var(--olive); }
        .footer-nav { display:flex; justify-content:center; gap: 28px; list-style:none; padding:0; margin: 0 0 26px; flex-wrap: wrap; }
        .footer-nav li { font-size: 14px; cursor:pointer; opacity:.9; color: var(--olive); }
        .footer-contact p { font-size: 14px; opacity: .9; margin: 6px 0; color: var(--olive); }
        .footer-bottom { border-top: 1px solid rgba(146,122,93,0.25); padding-top: 18px; font-size: 12px; opacity: .7; margin-top: 20px; color: var(--olive); }

        .whatsapp-fab { position: fixed; bottom: 24px; right: 24px; z-index: 50; width: 90px; height: 90px; border-radius: 11px;
          overflow: hidden; display:flex; align-items:center; justify-content:center; border:none;
          background: none; cursor:pointer; transition: transform .25s; text-decoration:none; }
        .whatsapp-fab img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .whatsapp-fab img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .whatsapp-fab:hover { transform: scale(1.08); }
.cart-toast { position: fixed; top: 90px; right: 24px; z-index: 90; background: var(--white); border: 1px solid var(--tan);
          border-radius: 14px; box-shadow: 0 12px 30px rgba(74,58,44,0.18); padding: 14px 16px; display:flex; align-items:center; gap: 12px;
          max-width: 280px; animation: toastIn .3s ease; }
        .cart-toast-icon { width: 28px; height: 28px; border-radius: 50%; background: #DCEFE2; color: #2E7D4F; display:flex;
          align-items:center; justify-content:center; flex-shrink:0; }
        .cart-toast-text { display:flex; flex-direction:column; font-size: 12.5px; color: var(--olive); }
        .cart-toast-text strong { color: var(--ink); font-weight: 400; font-family:'Marcellus'; font-size: 13.5px; }
        .cart-toast-btn { background: none; border: none; color: var(--olive); text-decoration: underline; font-size: 12px; cursor:pointer; white-space:nowrap; }
        @keyframes toastIn { from { opacity:0; transform: translateY(-8px); } to { opacity:1; transform: translateY(0); } }

        @media (max-width: 900px) {
          .nav-links { display:none; } .menu-toggle { display:block; }
        }
      `}</style>

      <div className="announce">Envíos a todo Colombia. Compra Dolce, compra local.</div>

      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-left">
          <Link href="/" className="brand">
            <img src="/logoprincipal.png" alt="Dolce Giftbox" className="brand-logo-img" />
          </Link>
          <ul className="nav-links">
            <li><Link href="/">Inicio</Link></li>
            <li className="nav-dropdown">
              <Link href="/productos">Detalles prediseñados</Link>
              <div className="dropdown-menu">
                {CATEGORIES.map((cat) => (
                  <Link key={cat} href={`/productos?categoria=${encodeURIComponent(cat)}`}>{cat}</Link>
                ))}
                <Link href="/productos" className="dropdown-all">Todos</Link>
              </div>
            </li>
            <li><Link href="/arma-tu-detalle">Arma tu detalle</Link></li>
            <li><Link href="/quienes-somos">Quiénes Somos</Link></li>
            <li className="nav-dropdown">
              <span>Dudas</span>
              <div className="dropdown-menu">
                <Link href="/preguntas-frecuentes">Preguntas Frecuentes</Link>
                <Link href="/terminos-y-condiciones">Términos y Condiciones</Link>
                <Link href="/politica-de-privacidad">Política de Privacidad</Link>
              </div>
            </li>
          </ul>
        </div>
        <div className="nav-icons">
          <button className="icon-btn" aria-label="Buscar" onClick={() => setSearchOpen(true)}><Search size={19} /></button>
          <button className="icon-btn" aria-label="Cuenta"><User size={19} /></button>
          <button className="icon-btn" aria-label="Carrito" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={19} />
            {totalCount > 0 && <span className="cart-badge">{totalCount}</span>}
          </button>
          <button className="menu-toggle" aria-label="Menú" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-menu">
          <button className="mobile-close" onClick={() => setMenuOpen(false)}><X size={26} /></button>
          <img src="/logoprincipal.png" alt="Dolce Giftbox" className="mobile-menu-logo" />
          <ul>
            <li onClick={() => setMenuOpen(false)}><Link href="/">Inicio</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/productos">Detalles prediseñados</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/arma-tu-detalle">Arma tu detalle</Link></li>
            <li onClick={() => setMenuOpen(false)}><Link href="/quienes-somos">Quiénes Somos</Link></li>
            <li className="mobile-dudas" onClick={() => setDudasOpen(!dudasOpen)}>
              <span>Dudas</span>
              <ChevronDown size={16} className={`mobile-dudas-icon ${dudasOpen ? "open" : ""}`} />
            </li>
            {dudasOpen && (
              <>
                <li className="mobile-sublink" onClick={() => setMenuOpen(false)}><Link href="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
                <li className="mobile-sublink" onClick={() => setMenuOpen(false)}><Link href="/terminos-y-condiciones">Términos y Condiciones</Link></li>
                <li className="mobile-sublink" onClick={() => setMenuOpen(false)}><Link href="/politica-de-privacidad">Política de Privacidad</Link></li>
              </>
            )}
          </ul>
        </div>
      )}

      <div className="page-header">
        <p className="breadcrumbs"><Link href="/">Inicio</Link> <span>.</span> <span className="active">Términos y Condiciones</span></p>
        <h1>Términos y Condiciones</h1>
        <p>Última actualización: 7 de agosto de 2026</p>
      </div>

      <div className="legal-wrap">
        <LegalBlocks blocks={CONTENT} />
      </div>

      <footer className="footer">
        <div className="footer-icon"><AtSign size={20} /></div>
        <ul className="footer-nav">
          <li><Link href="/">Inicio</Link></li>
          <li><Link href="/productos">Detalles prediseñados</Link></li>
          <li><Link href="/arma-tu-detalle">Arma tu detalle</Link></li>
          <li><Link href="/contacto">Contacto</Link></li>
          <li><Link href="/quienes-somos">Quiénes Somos</Link></li>
        <li><Link href="/preguntas-frecuentes">Preguntas Frecuentes</Link></li>
          <li><Link href="/terminos-y-condiciones">Términos y Condiciones</Link></li>
          <li><Link href="/politica-de-privacidad">Política de Privacidad</Link></li>
        </ul>
        <div className="footer-contact">
          <p>+57 311 329 0390 (WhatsApp)</p>
          <p>311 329 0390</p>
          <p>dolcegiftboxcolombia@gmail.com</p>
        </div>
        <div className="footer-bottom">Copyright Dolce Gift Box — 2026. Todos los derechos reservados.</div>
      </footer>

     <a className="whatsapp-fab" href="https://wa.me/573113290390" target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">
        <img src="/whatsapp-boton.png" alt="Escríbenos por WhatsApp" />
      </a>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <CartToast onViewCart={() => setCartOpen(true)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}