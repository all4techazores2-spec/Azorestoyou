import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Receipt, ArrowLeft, Download, Eye, FileText, UtensilsCrossed, Sparkles, ShoppingBag, Hotel, Home, Car, Plane, Camera, Briefcase, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Restaurant } from '../types';

interface InvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: any[];
  restaurants: Restaurant[];
  beauty: any[];
  userProfile: any;
  language: any;
}

const CATEGORY_META: Record<string, { label: string; icon: React.ReactNode; color: string; shadow: string }> = {
  restaurant: { label: 'Restaurantes', icon: <UtensilsCrossed size={20} />, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
  beauty: { label: 'Beleza & Bem-Estar', icon: <Sparkles size={20} />, color: 'from-fuchsia-500 to-pink-600', shadow: 'shadow-fuchsia-500/20' },
  shop: { label: 'Lojas & Comércio', icon: <ShoppingBag size={20} />, color: 'from-indigo-500 to-violet-600', shadow: 'shadow-indigo-500/20' },
  hotel: { label: 'Hotéis', icon: <Hotel size={20} />, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
  al: { label: 'Alojamento Local', icon: <Home size={20} />, color: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/20' },
  car: { label: 'Aluguer de Carros', icon: <Car size={20} />, color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
  flight: { label: 'Voos', icon: <Plane size={20} />, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
  landscape: { label: 'Paisagens & Trilhos', icon: <Camera size={20} />, color: 'from-orange-400 to-rose-500', shadow: 'shadow-orange-500/20' },
  package: { label: 'Pacotes Turísticos', icon: <Briefcase size={20} />, color: 'from-blue-600 to-indigo-700', shadow: 'shadow-blue-600/20' }
};

const DEFAULT_CATEGORY = { label: 'Outros', icon: <CreditCard size={20} />, color: 'from-slate-600 to-slate-800', shadow: 'shadow-slate-500/20' };

export const InvoicesModal: React.FC<InvoicesModalProps> = ({
  isOpen,
  onClose,
  reservations = [],
  restaurants = [],
  beauty = [],
  userProfile,
  language
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeSimplePopup, setActiveSimplePopup] = useState<any | null>(null);
  const [activeDetailPopup, setActiveDetailPopup] = useState<any | null>(null);

  if (!isOpen) return null;

  // Helper to determine business type / category
  const getResType = (r: any) => r.type || r.businessType || 'restaurant';

  // Filter finished / completed reservations (Invoices)
  const finishedReservations = reservations.filter(r => 
    ['finished', 'concluida', 'concluído'].includes(r.status)
  );

  // Group by category to find out which categories have invoices
  const categoriesWithInvoices = Array.from(
    new Set(finishedReservations.map(r => getResType(r)))
  );

  const getInvoiceNumber = (r: any) => {
    if (r.invoiceNumber) return r.invoiceNumber;
    const cleanId = String(r.id).replace(/\D/g, '').substring(0, 6);
    const dateYear = r.date ? r.date.split('/')[2] || new Date().getFullYear() : new Date().getFullYear();
    return `FR ${dateYear}/${cleanId.padStart(6, '0')}`;
  };

  const getInvoiceLocation = (r: any) => {
    return r.itemName || r.restaurantName || r.businessName || 'Azores Establishments';
  };

  const getInvoiceTotal = (r: any) => {
    if (r.totalBill) return r.totalBill;
    if (r.total) return r.total;
    if (r.price) return r.price;
    // Calculate from preorder items if present
    const preOrder = r.preOrder || r.preorder || [];
    if (preOrder.length > 0) {
      return preOrder.reduce((acc: number, item: any) => acc + ((item.dish?.promoPrice || item.dish?.price || item.price || 15) * item.quantity), 0);
    }
    return 35.00; // default mockup value
  };

  const generateReceiptHTML = (invoice: any) => {
    const number = getInvoiceNumber(invoice);
    const location = getInvoiceLocation(invoice);
    const total = getInvoiceTotal(invoice);
    const date = invoice.date || new Date().toLocaleDateString('pt-PT');
    const time = invoice.time || '20:00';
    const clientNif = userProfile?.nif || '999999990';
    const subtotal = total / 1.13;
    const iva = total - subtotal;
    const atcud = invoice.atcud || `JF5T-3E2C-7P1X-${String(invoice.id).replace(/\D/g, '').substring(0, 6).padStart(6, '0')}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`A:509999999*B:${clientNif}*C:PT*D:FR*E:N*F:20260602*G:${number}*H:${atcud}*I1:PT*I3:${iva.toFixed(2)}*O:${total.toFixed(2)}`)}`;

    return `
      <html>
        <head>
          <title>Fatura Recibo - ${location}</title>
          <style>
            body {
              font-family: 'Courier New', Courier, monospace;
              padding: 20px;
              color: #000;
              max-width: 320px;
              margin: 0 auto;
              font-size: 11px;
              line-height: 1.4;
            }
            .text-center { text-align: center; }
            .font-black { font-weight: bold; }
            .font-bold { font-weight: bold; }
            .flex { display: flex; justify-content: space-between; }
            .border-y { border-top: 1px dashed #000; border-bottom: 1px dashed #000; }
            .border-t { border-top: 1px dashed #000; }
            .my-2 { margin-top: 8px; margin-bottom: 8px; }
            .py-1 { padding-top: 4px; padding-bottom: 4px; }
            .mb-4 { margin-bottom: 16px; }
            .mt-4 { margin-top: 16px; }
            .qr-container { display: flex; justify-content: center; margin: 15px 0; }
            .qr-code { width: 120px; height: 120px; border: 1px solid #ccc; padding: 5px; }
          </style>
        </head>
        <body onload="window.print(); setTimeout(function(){ window.close(); }, 500);">
          <div class="text-center mb-4">
            <h4 class="font-black" style="margin: 0 0 4px 0; font-size: 14px; text-transform: uppercase;">${location}</h4>
            <p style="margin: 2px 0;">RUAS DOS AÇORES, PONTA DELGADA</p>
            <p style="margin: 2px 0;">NIF: 509999999</p>
            <p style="margin: 2px 0;">TEL: +351 296 282 888</p>
          </div>

          <div class="text-center font-bold border-y py-1 my-2">
            FATURA RECIBO ${number}
          </div>

          <div class="mb-4">
            <div class="flex"><span>Data: ${date} ${time}</span></div>
            <div class="flex"><span>Operador: AzoresPOS</span></div>
            <div class="flex"><span>NIF Cliente: ${clientNif}</span></div>
          </div>

          <div class="border-t py-1">
            <div class="flex font-bold">
              <span>Qt. Descrição</span>
              <span>Total</span>
            </div>
            <div class="border-t my-2"></div>
            <div class="flex">
              <span>1x Serviço de ${location}</span>
              <span>€${total.toFixed(2)}</span>
            </div>
          </div>

          <div class="border-t mt-4 pt-2">
            <div class="flex font-bold">
              <span>Subtotal</span>
              <span>€${subtotal.toFixed(2)}</span>
            </div>
            <div class="flex">
              <span>  IVA 13% (Base: €${subtotal.toFixed(2)})</span>
              <span>€${iva.toFixed(2)}</span>
            </div>
            <div class="border-t my-2"></div>
            <div class="flex font-bold" style="font-size: 13px;">
              <span>TOTAL A PAGAR</span>
              <span>€${total.toFixed(2)}</span>
            </div>
          </div>

          <div class="border-t mt-4 pt-2">
            <div class="flex">
              <span>Método Pagamento:</span>
              <span>MBWay / Presencial</span>
            </div>
          </div>

          <div class="border-t mt-4 pt-2 text-center">
            <p class="font-bold" style="margin: 0 0 5px 0;">ATCUD: ${atcud}</p>
            <div class="qr-container">
              <img src="${qrCodeUrl}" class="qr-code" alt="QR" />
            </div>
            <p style="margin: 2px 0; font-size: 9px; color: #555;">Processado por programa certificado nº 1234/AT</p>
            <p style="margin: 2px 0; font-size: 9px; color: #555;">Software: Azores4you v1.0</p>
            <p style="margin: 2px 0; font-size: 9px; color: #555;">Certificação: 2026/AT</p>
          </div>

          <div class="text-center font-bold border-t mt-4 pt-2">
            OBRIGADO PELA SUA PREFERÊNCIA!<br/>VOLTE SEMPRE!
          </div>
        </body>
      </html>
    `;
  };

  const handleDownloadPDF = (invoice: any) => {
    const html = generateReceiptHTML(invoice);
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.bottom = '0';
    iframe.style.right = '0';
    document.body.appendChild(iframe);
    
    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }

    // Remove the iframe after a short delay so print dialog can trigger
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col max-h-[85vh] border border-white"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl -mr-32 -mt-32 z-0"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -ml-32 -mb-32 z-0"></div>

        {/* Header */}
        <div className="relative z-10 p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-5">
            {selectedCategory ? (
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center transition-all active:scale-90"
              >
                <ArrowLeft size={24} className="text-slate-600" />
              </button>
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-amber-500/30 ring-4 ring-amber-50">
                <Receipt size={28} />
              </div>
            )}
            <div className="text-left">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {selectedCategory ? CATEGORY_META[selectedCategory]?.label || 'Faturas' : 'Minhas Faturas'}
              </h2>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mt-0.5">
                {selectedCategory ? 'Lista de faturas registadas' : 'Consulte os seus talões e faturas pagas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white text-slate-800 hover:bg-blue-600 hover:text-white rounded-full transition-all shadow-lg border border-slate-100 group"
          >
            <X size={20} className="group-active:scale-90 transition-transform" />
          </button>
        </div>

        {/* Content Area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar text-left">
          <AnimatePresence mode="wait">
            {!selectedCategory ? (
              <motion.div
                key="categories-list"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 gap-4 py-4"
              >
                {categoriesWithInvoices.length > 0 ? (
                  categoriesWithInvoices.map((catKey) => {
                    const meta = CATEGORY_META[catKey] || DEFAULT_CATEGORY;
                    const count = finishedReservations.filter(r => getResType(r) === catKey).length;
                    return (
                      <button
                        key={catKey}
                        onClick={() => setSelectedCategory(catKey)}
                        className="group flex items-center justify-between p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-100 transition-all duration-300"
                      >
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 bg-gradient-to-br ${meta.color} rounded-3xl flex items-center justify-center text-white shadow-lg ${meta.shadow} group-hover:scale-110 transition-transform`}>
                            {meta.icon}
                          </div>
                          <div className="text-left">
                            <h3 className="font-black text-xl text-slate-800 tracking-tight">{meta.label}</h3>
                            <p className="text-xs font-bold text-slate-400 mt-1">
                              {count === 1 ? '1 fatura disponível' : `${count} faturas disponíveis`}
                            </p>
                          </div>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                          <Eye size={20} />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="py-24 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 relative">
                      <Receipt size={48} className="text-slate-200" />
                      <div className="absolute top-0 right-0 w-6 h-6 bg-amber-500 rounded-full border-4 border-white"></div>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Sem faturas ainda?</h3>
                    <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm leading-relaxed">
                      As suas faturas aparecerão aqui depois de efetuar pagamentos nos estabelecimentos e fechar a sua conta.
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="invoices-list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {finishedReservations
                  .filter(r => getResType(r) === selectedCategory)
                  .map((invoice) => {
                    const number = getInvoiceNumber(invoice);
                    const location = getInvoiceLocation(invoice);
                    const total = getInvoiceTotal(invoice);
                    return (
                      <div
                        key={invoice.id}
                        onClick={() => setActiveSimplePopup(invoice)}
                        className="group p-5 bg-white hover:bg-slate-50/50 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex justify-between items-center text-left"
                      >
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            {number}
                          </span>
                          <h4 className="font-black text-base text-slate-800 pt-1 group-hover:text-amber-600 transition-colors">
                            {location}
                          </h4>
                          <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px]">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {invoice.date}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {invoice.time || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor Pago</p>
                          <p className="font-black text-lg text-slate-800">€{total.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Simple Information Popup */}
      <AnimatePresence>
        {activeSimplePopup && (() => {
          const number = getInvoiceNumber(activeSimplePopup);
          const location = getInvoiceLocation(activeSimplePopup);
          const total = getInvoiceTotal(activeSimplePopup);
          return (
            <div className="fixed inset-0 z-[160] flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white border border-slate-100 p-8 rounded-[2.5rem] max-w-md w-full text-slate-800 shadow-2xl relative space-y-6 text-center"
              >
                <button
                  onClick={() => setActiveSimplePopup(null)}
                  className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
                >
                  <X size={18} />
                </button>

                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                  <FileText size={28} />
                </div>

                <div>
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{number}</span>
                  <h3 className="text-2xl font-black text-slate-800 mt-1 uppercase tracking-tight">{location}</h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">Data da Venda: {activeSimplePopup.date} às {activeSimplePopup.time || 'N/A'}</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center text-left">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Faturado</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">NIF Cliente: {userProfile?.nif || 'Consumidor Final'}</p>
                  </div>
                  <span className="text-2xl font-black text-slate-800">€{total.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleDownloadPDF(activeSimplePopup)}
                    className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center gap-1.5 active:scale-95 border border-slate-200/40"
                  >
                    <Download size={14} /> Download PDF
                  </button>
                  <button
                    onClick={() => {
                      setActiveDetailPopup(activeSimplePopup);
                      setActiveSimplePopup(null);
                    }}
                    className="py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <Eye size={14} /> Ver Detalhes
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* POS Format Invoice Detail Viewer */}
      <AnimatePresence>
        {activeDetailPopup && (() => {
          const number = getInvoiceNumber(activeDetailPopup);
          const location = getInvoiceLocation(activeDetailPopup);
          const total = getInvoiceTotal(activeDetailPopup);
          const subtotal = total / 1.13;
          const iva = total - subtotal;
          const date = activeDetailPopup.date || new Date().toLocaleDateString('pt-PT');
          const time = activeDetailPopup.time || '20:00';
          const clientNif = userProfile?.nif || 'Consumidor Final';
          const atcud = activeDetailPopup.atcud || `JF5T-3E2C-7P1X-${String(activeDetailPopup.id).replace(/\D/g, '').substring(0, 6).padStart(6, '0')}`;
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`A:509999999*B:${clientNif === 'Consumidor Final' ? '999999990' : clientNif}*C:PT*D:FR*E:N*F:20260602*G:${number}*H:${atcud}*I1:PT*I3:${iva.toFixed(2)}*O:${total.toFixed(2)}`)}`;

          return (
            <div className="fixed inset-0 z-[170] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-[370px] flex flex-col justify-start items-center relative my-8"
              >
                {/* Close and Download Floating Actions */}
                <div className="w-full flex justify-between items-center mb-4 z-50">
                  <button
                    onClick={() => {
                      setActiveSimplePopup(activeDetailPopup);
                      setActiveDetailPopup(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900/80 backdrop-blur-md hover:bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-wider transition-all"
                  >
                    <ArrowLeft size={14} /> Voltar
                  </button>
                  <button
                    onClick={() => handleDownloadPDF(activeDetailPopup)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-lg"
                  >
                    <Download size={14} /> PDF
                  </button>
                </div>

                {/* Thermal Printer Mockup Visual */}
                <div className="w-full h-8 bg-slate-800 rounded-t-2xl border-t border-x border-slate-700 shadow-inner flex justify-between items-center px-4 relative z-20">
                  <span className="text-[6px] text-slate-500 font-bold uppercase tracking-wider">AzoresPOS Terminal</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  </div>
                </div>

                {/* Thermal paper container */}
                <div className="w-full origin-top relative shadow-2xl">
                  {/* Jagged serrated top border */}
                  <div className="w-full h-2 overflow-hidden leading-none text-white bg-transparent select-none drop-shadow-[0_-1px_1px_rgba(0,0,0,0.1)] relative z-10">
                    <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full fill-white">
                      <polygon points="0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10 100,0 0,0" />
                    </svg>
                  </div>

                  {/* Mono POS invoice receipt */}
                  <div className="bg-white text-slate-900 px-6 py-6 font-mono text-[10px] leading-relaxed relative border-x border-white/90 select-text">
                    <div className="text-center space-y-1 mb-4 uppercase text-slate-800">
                      <h4 className="text-xs font-black tracking-widest">{location}</h4>
                      <p className="text-[8px] text-slate-500 leading-tight">RUA DOS AÇORES, PONTA DELGADA</p>
                      <p className="text-[8px] text-slate-500">NIF: 509999999</p>
                      <p className="text-[8px] text-slate-500">Tel: +351 296 282 888</p>
                    </div>

                    <div className="text-center font-bold border-y-2 border-dashed border-slate-350 py-1 my-2 uppercase tracking-wide text-slate-800">
                      FATURA RECIBO {number}
                    </div>

                    <div className="space-y-0.5 mb-3 text-slate-700">
                      <p>Data: {date} {time}</p>
                      <p>Mesa: Balcão · Oper: AzoresPOS</p>
                      <p>NIF Cliente: {clientNif}</p>
                    </div>

                    <div className="border-t border-dashed border-slate-300 pt-1">
                      <div className="flex font-bold text-slate-800 justify-between">
                        <span>Qt. Descrição</span>
                        <span>Total</span>
                      </div>
                      <div className="border-t border-dashed border-slate-300 my-1"></div>
                      <div className="space-y-0.5 text-slate-700 flex justify-between">
                        <span>1x Serviço de {location}</span>
                        <span>€{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-slate-300 mt-3 pt-2 space-y-1 text-slate-700">
                      <div className="flex font-bold text-slate-850 justify-between">
                        <span>Subtotal</span>
                        <span>€{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex text-slate-500 justify-between">
                        <span>  IVA 13% (Base: €{subtotal.toFixed(2)})</span>
                        <span>€{iva.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-dashed border-slate-200 my-1"></div>
                      <div className="flex font-black text-slate-900 justify-between text-xs">
                        <span>TOTAL A PAGAR</span>
                        <span>€{total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-slate-300 mt-2.5 pt-2 text-slate-700">
                      <div className="flex justify-between">
                        <span>Método Pagamento:</span>
                        <span>Presencial / MBWay</span>
                      </div>
                    </div>

                    <div className="border-t-2 border-dashed border-slate-300 mt-4 pt-3 flex flex-col items-center space-y-2">
                      <p className="text-[8px] text-slate-800 font-bold text-center">ATCUD: {atcud}</p>
                      <div className="bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
                        <img src={qrCodeUrl} className="w-[100px] h-[100px]" alt="QR Code" />
                      </div>
                      <div className="text-[7.5px] text-slate-400 text-center leading-tight space-y-0.5">
                        <p>Processado por programa certificado nº 1234/AT</p>
                        <p>Software: Azores4you v1.0</p>
                        <p>Certificação: 2026/AT</p>
                      </div>
                    </div>

                    <div className="text-center font-bold text-slate-700 border-t border-dashed border-slate-300 mt-4 pt-3 uppercase tracking-wider text-[8.5px]">
                      Obrigado pela sua preferência!<br />Volte sempre!
                    </div>
                  </div>

                  {/* Jagged serrated bottom border */}
                  <div className="w-full h-2 overflow-hidden leading-none text-white bg-transparent select-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)] relative z-10">
                    <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="w-full h-full fill-white">
                      <polygon points="0,0 5,10 10,0 15,10 20,0 25,10 30,0 35,10 40,0 45,10 50,0 55,10 60,0 65,10 70,0 75,10 80,0 85,10 90,0 95,10 100,0 100,10 0,10" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
