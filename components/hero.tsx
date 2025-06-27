export const Hero = () => {
  return (
    <div className="flex flex-col gap-8 pb-8 md:pb-16 md:gap-16">
      <div className="flex flex-col items-center gap-8 md:gap-12">
        <div className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            B&C Propiedades
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Descubre las mejores propiedades disponibles. Nuestro sistema te
            permite explorar casas, departamentos y terrenos de forma fácil y
            eficiente.
          </p>
        </div>
      </div>
    </div>
  );
};
