import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="relative w-full min-h-[240px] sm:min-h-[300px] flex flex-col items-center justify-center overflow-hidden bg-transparent">
      
      {/* Background Layer: Máscara de Transição Gradual */}
      <div className="absolute inset-0 z-0 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
        <div className="relative w-full h-full overflow-hidden filter blur-[20px] opacity-80 scale-110">
          {/* Imagem de Mandela */}
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Nelson_Mandela_1994.jpg/1200px-Nelson_Mandela_1994.jpg" 
            alt="Mandela Background" 
            className="absolute inset-0 w-full h-full object-cover grayscale contrast-125"
          />
          {/* Camada da Bandeira Vibrante */}
          <div 
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-90"
            style={{ backgroundImage: 'url("https://flagcdn.com/w2560/za.png")' }}
          ></div>
        </div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-full flex flex-col items-center justify-center px-4 py-8 text-center">
        
        {/* Logo Principal com Terra 4K */}
        <div className="animate-in fade-in zoom-in duration-1000 flex flex-col items-center w-full">
          <h1 className="font-display font-black text-white text-[10vw] sm:text-[11vw] md:text-[11.5vw] lg:text-[12vw] tracking-tighter text-shadow-heavy uppercase leading-none italic flex flex-row flex-nowrap items-center justify-center select-none whitespace-nowrap drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
            <span className="drop-shadow-2xl">CHECK-IN,</span>
            <span className="flex items-center ml-[0.12em]">
              G
              <div className="relative inline-flex items-center justify-center w-[1.1em] h-[1.1em] mx-[-0.05em]">
                {/* Atmosfera e Brilho Blue Marble */}
                <div className="absolute inset-0 rounded-full bg-blue-400/30 blur-2xl animate-pulse"></div>
                
                {/* Planeta Terra 4K Realista */}
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Earth_Western_Hemisphere_transparent_background.png/1200px-Earth_Western_Hemisphere_transparent_background.png" 
                  alt="Terra Ultra Realista"
                  className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_30px_rgba(59,130,246,1)] animate-[spin_120s_linear_infinite]"
                />
              </div>
              !
            </span>
          </h1>
          
          {/* Subtítulo Estilizado */}
          <h2 className="font-display font-black text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0.4em] text-shadow-heavy uppercase mt-2 drop-shadow-[0_10px_20px_rgba(0,0,0,1)]">
            ÁFRICA DO SUL
          </h2>
        </div>

        {/* Linha de Destaque Dourada Premium */}
        <div className="w-[22vw] max-w-[160px] h-1.5 bg-sa-gold rounded-full mt-6 shadow-[0_0_30px_rgba(255,184,28,0.8)] animate-pulse"></div>
      </div>
    </div>
  );
};

export default Header;