import { Contract, Payment, Client } from '../types';

declare const html2pdf: any;

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const PdfService = {
  async exportContractPdf(contractElement: HTMLElement, clientName: string): Promise<boolean> {
    try {
      const clone = contractElement.cloneNode(true) as HTMLElement;
      clone.style.boxShadow = 'none';
      clone.style.margin = '0 auto';
      clone.style.width = '100%';
      clone.style.maxWidth = '820px';
      clone.style.background = '#ffffff';
      clone.style.color = '#0f172a';

      // Asegurar que las imágenes del clon no contaminen el canvas
      const imgs = clone.querySelectorAll('img');
      imgs.forEach(img => {
        img.crossOrigin = 'anonymous';
      });

      document.body.appendChild(clone);

      if (typeof html2pdf !== 'undefined') {
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `Acuerdo_Servicios_${clientName.replace(/\s+/g, '_')}_AdrianReyesCreativo.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        await html2pdf().set(opt).from(clone).save();
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        return true;
      } else {
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        window.print();
        return true;
      }
    } catch (err) {
      console.error('Error al exportar contrato PDF:', err);
      window.print();
      return false;
    }
  },

  async generatePaymentReceipt(payment: Payment, client?: Client): Promise<boolean> {
    try {
      const monthName = MONTH_NAMES[payment.month] || 'Mes';
      const folio = payment.receiptFolio || `REC-${payment.year}-${payment.id}`;
      const currSymbol = payment.currency === 'USD' ? '$' : 'L ';
      const currCode = payment.currency || 'HNL';

      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '800px';
      container.style.background = '#ffffff';
      container.style.color = '#0f172a';
      container.style.padding = '36px 42px';
      container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

      container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ff7a00; padding-bottom: 18px; margin-bottom: 24px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="/assets/logo.png" style="height: 52px; object-fit: contain;" alt="Logo" crossorigin="anonymous">
            <div>
              <div style="font-size: 19px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; text-transform: uppercase;">ADRIÁN REYES <span style="color: #ff7a00;">CREATIVO</span></div>
              <div style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Estrategia Digital, Marketing & Producción</div>
            </div>
          </div>
          <div style="text-align: right; background: #fff7ed; border: 1.5px solid #ffedd5; padding: 10px 18px; border-radius: 8px;">
            <div style="font-size: 16px; font-weight: 900; color: #ea580c; letter-spacing: 0.5px;">RECIBO OFICIAL DE PAGO</div>
            <div style="font-size: 12px; font-weight: 700; color: #334155; margin-top: 2px;">Folio: ${folio}</div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
          <div>
            <h5 style="font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; font-weight: 800; margin: 0 0 6px 0;">DATOS DEL CLIENTE / RECEPTOR</h5>
            <p style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 3px 0;">${payment.clientName}</p>
            <p style="font-size: 12.5px; font-weight: 600; color: #ea580c; margin: 0 0 6px 0;">${payment.brandName || client?.brandName || 'Negocio / Marca'}</p>
            ${client?.email ? `<p style="font-size: 11.5px; color: #64748b; margin: 2px 0;">✉️ ${client.email}</p>` : ''}
            ${client?.phone ? `<p style="font-size: 11.5px; color: #64748b; margin: 2px 0;">📞 ${client.phone}</p>` : ''}
          </div>
          <div style="text-align: right;">
            <h5 style="font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; font-weight: 800; margin: 0 0 6px 0;">DETALLES DE LA TRANSACCIÓN</h5>
            <p style="font-size: 12.5px; color: #334155; margin: 2px 0;"><strong>Fecha de Pago:</strong> ${payment.paidDate}</p>
            <p style="font-size: 12.5px; color: #334155; margin: 2px 0;"><strong>Periodo Liquidado:</strong> ${monthName} ${payment.year}</p>
            <p style="font-size: 12.5px; color: #334155; margin: 2px 0;"><strong>Método:</strong> ${payment.method || 'Transferencia'}</p>
            ${payment.reference ? `<p style="font-size: 11.5px; color: #64748b; margin: 2px 0;"><strong>Ref:</strong> ${payment.reference}</p>` : ''}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="background: #0f172a; color: #ffffff;">
              <th style="padding: 10px 14px; text-align: left; font-size: 11.5px; font-weight: 700;">Descripción / Concepto</th>
              <th style="padding: 10px 14px; width: 140px; text-align: center; font-size: 11.5px; font-weight: 700;">Periodo</th>
              <th style="padding: 10px 14px; width: 150px; text-align: right; font-size: 11.5px; font-weight: 700;">Total Cancelado</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e2e8f0; background: #ffffff;">
              <td style="padding: 16px 14px;">
                <div style="font-weight: 800; color: #0f172a; font-size: 13.5px;">${client?.planName || 'Plan de Gestión & Marketing Digital'}</div>
                <div style="font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.45;">
                  ${payment.description || `Servicio Profesional de Estrategia, Creación de Contenido y Gestión de Redes Sociales — Liquidación de ${monthName} ${payment.year}`}
                </div>
              </td>
              <td style="padding: 16px 14px; text-align: center; font-weight: 700; color: #ea580c; font-size: 13px;">
                ${monthName} ${payment.year}
              </td>
              <td style="padding: 16px 14px; text-align: right; font-weight: 900; font-size: 16px; color: #0f172a;">
                ${currSymbol}${payment.amount.toLocaleString()} ${currCode}
              </td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center; background: #0f172a; color: #ffffff; padding: 18px 22px; border-radius: 8px; margin-bottom: 26px;">
          <div>
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; font-weight: 700;">TOTAL RECIBIDO Y CONCILIADO</div>
            <div style="font-size: 11.5px; color: #cbd5e1; margin-top: 2px;">Moneda: ${currCode === 'USD' ? 'Dólares Estadounidenses (USD)' : 'Lempiras Hondureños (HNL)'}</div>
          </div>
          <div style="font-size: 24px; font-weight: 900; color: #4ade80;">
            ${currSymbol}${payment.amount.toLocaleString()} ${currCode}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px;">
          <div style="display: inline-flex; align-items: center; gap: 8px; border: 2px dashed #10b981; background: #ecfdf5; color: #047857; padding: 10px 20px; border-radius: 8px; font-weight: 900; font-size: 13px; text-transform: uppercase;">
            ✓ PAGO CANCELADO / RECIBIDO
          </div>
          <div style="text-align: right;">
            <div style="font-size: 12.5px; font-weight: 800; color: #0f172a;">ADRIÁN REYES CREATIVO</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Firma y Sello Digital Autorizado</div>
          </div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #64748b; line-height: 1.5; text-align: center;">
          Este documento constituye un comprobante formal de recepción de pago por los servicios profesionales acordados.<br>
          ¡Gracias por confiar en <strong>Adrián Reyes Creativo</strong> para potenciar tu marca!
        </div>
      `;

      document.body.appendChild(container);

      if (typeof html2pdf !== 'undefined') {
        const opt = {
          margin: [12, 12, 12, 12],
          filename: `Recibo_${payment.clientName.replace(/\s+/g, '_')}_${folio}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(container).save();
        container.remove();
        return true;
      } else {
        container.remove();
        window.print();
        return true;
      }
    } catch (err) {
      console.error('Error al generar recibo PDF:', err);
      return false;
    }
  }
};
