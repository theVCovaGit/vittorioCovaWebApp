export default function Join() {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Únete a Nikken</h1>
        <p className="text-lg text-justify leading-relaxed mb-4">
          Nikken es una comunidad dedicada a mejorar la calidad de vida de las personas a través de productos innovadores y un enfoque en el bienestar integral. 
          Al unirte a nuestra red, tendrás la oportunidad de ser parte de un equipo apasionado que promueve salud, equilibrio y éxito personal.
        </p>
        <p className="text-lg text-justify leading-relaxed mb-8">
          ¡Forma parte de una red global que valora el bienestar y el crecimiento personal mientras construyes un futuro lleno de oportunidades! 
          Para unirte, simplemente sigue el enlace a continuación.
        </p>
        <p className="text-center text-lg">
          Para unirte, sigue este enlace:{""}
          <a
            href="https://mi.nikkenlatam.com/home"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-accent underline transition"
          >
            Únete aquí
          </a>
        </p>
      </div>
    );
  }
  