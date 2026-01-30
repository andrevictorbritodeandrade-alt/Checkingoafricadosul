import React, { useState } from 'react';
import { 
  Syringe, 
  ShieldCheck, 
  FileText, 
  User, 
  Calendar, 
  Fingerprint, 
  Globe, 
  CheckCircle2,
  AlertCircle,
  QrCode
} from 'lucide-react';

interface CertificateData {
  name: string;
  sex: string;
  birthDate: string;
  nationality: string;
  idDocument: string;
  vaccine: string;
  date: string;
  manufacturerBatch: string;
  validFrom: string;
  validTo: string;
}

const CERTIFICATES: Record<'André' | 'Marcelly', CertificateData> = {
  'André': {
    name: 'ANDRE VICTOR BRITO DE ANDRADE',
    sex: 'Masculino',
    birthDate: '10/08/1989',
    nationality: 'Brasil',
    idDocument: 'RG - 225064245',
    vaccine: 'FEBRE AMARELA (YELLOW FEVER)',
    date: '29-DEC-2025',
    manufacturerBatch: 'Fiocruz - 253VFA009W',
    validFrom: '08-JAN-2026',
    validTo: 'PARA A VIDA TODA (LIFE)'
  },
  'Marcelly': {
    name: 'MARCELLY BISPO PEREIRA da SILVA',
    sex: 'Feminino',
    birthDate: '19/01/1992',
    nationality: 'Brasil',
    idDocument: 'CPF - 140.192.717-39',
    vaccine: 'FEBRE AMARELA (YELLOW FEVER)',
    date: '29-DEC-2025',
    manufacturerBatch: 'Fiocruz - 253VFA009W',
    validFrom: '08-JAN-2026',
    validTo: 'PARA A VIDA TODA (LIFE)'
  }
};

const VaccineCertificate: React.FC = () => {
  const [activePerson, setActivePerson] = useState<'André' | 'Marcelly'>('André');
  const cert = CERTIFICATES[activePerson];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Tab Switcher */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
        {(['André', 'Marcelly'] as const).map((person) => (
          <button
            key={person}
            onClick={() => setActivePerson(person)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black font-display uppercase tracking-widest transition-all ${
              activePerson === person 
                ? 'bg-white text-sa-green shadow-md ring-1 ring-black/5' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User className={`w-4 h-4 ${activePerson === person ? 'text-sa-green' : 'text-slate-300'}`} />
            {person}
          </button>
        ))}
      </div>

      {/* Digital Certificate Card */}
      <div className="relative group">
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-[34px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative p-6 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
          {/* Header Documento */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100 shadow-sm">
                <Syringe className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-left">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Certificado Internacional</h3>
                <h2 className="text-sm font-display font-black text-slate-800 leading-none">CIVP / WHO</h2>
              </div>
            </div>
            <div className="bg-green-50 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1.5">
               <CheckCircle2 className="w-3 h-3 text-green-600" />
               <span className="text-[9px] font-black text-green-700 uppercase tracking-wider">Válido</span>
            </div>
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 gap-5 mb-8">
            <div className="space-y-4">
              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] block mb-1">Nome Completo / Full Name</label>
                <p className="text-base font-display font-black text-slate-800 leading-tight uppercase">{cert.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] block mb-1">Nascimento / Birth</label>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-xs font-bold">{cert.birthDate}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] block mb-1">Documento / ID</label>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Fingerprint className="w-3.5 h-3.5 text-slate-300" />
                    <span className="text-xs font-bold">{cert.idDocument}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] block mb-1">Nacionalidade / Nationality</label>
                <div className="flex items-center gap-2 text-slate-700">
                  <Globe className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-xs font-bold uppercase">{cert.nationality}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vaccine Specs Section */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 space-y-4 mb-6">
             <div>
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Vacina / Vaccine</label>
                <p className="text-sm font-black text-amber-700">{cert.vaccine}</p>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Data / Date</label>
                   <p className="text-xs font-bold text-slate-700">{cert.date}</p>
                </div>
                <div>
                   <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Lote / Batch</label>
                   <p className="text-xs font-bold text-slate-700 truncate">{cert.manufacturerBatch}</p>
                </div>
             </div>

             <div className="pt-3 border-t border-slate-200/50">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Validade / Valid Until</label>
                <div className="flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-sa-green" />
                   <p className="text-xs font-black text-sa-green uppercase">{cert.validTo}</p>
                </div>
                <p className="text-[8px] text-slate-400 mt-1 italic">Válido a partir de: {cert.validFrom}</p>
             </div>
          </div>

          {/* Visual QR Simulation */}
          <div className="flex items-center gap-4 p-4 bg-slate-900 rounded-2xl">
             <div className="bg-white p-1 rounded-lg">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=CIVP_VERIFY_${cert.name.replace(/\s/g, '_')}_${cert.idDocument}`} 
                  alt="QR CIVP" 
                  className="w-12 h-12 mix-blend-multiply"
                />
             </div>
             <div className="flex-1">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Autenticidade</p>
                <p className="text-[10px] text-white leading-tight">Escaneie o código para conferir a validade internacional junto à ANVISA/WHO.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Alert */}
      <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start gap-3">
         <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
         <div>
            <p className="text-[11px] text-blue-900 font-bold leading-tight">
              A África do Sul exige o CIVP original. 
            </p>
            <p className="text-[10px] text-blue-700 mt-1 leading-relaxed">
              Mantenha o documento físico junto ao seu passaporte durante toda a viagem e imigração.
            </p>
         </div>
      </div>
    </div>
  );
};

export default VaccineCertificate;