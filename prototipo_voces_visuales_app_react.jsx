import React, { useState, useRef } from "react";

// Prototipo funcional (single-file) de la app "Voces Visuales".
// Requiere Tailwind CSS. Usa componentes simples para mostrar flujo:
// - Landing
// - Editor de cartel (secciones según rúbrica)
// - Checklist de rúbrica con scoring automático (/36)
// - Panel de jurado (evaluación)
// - Simulador de exposición (grabación mock)

export default function VocesVisualesPrototype() {
  const [view, setView] = useState("landing");
  const [poster, setPoster] = useState({
    title: "",
    introduction: "",
    methodology: "",
    results: "",
    references: "",
    bgColor: "bg-white",
    font: "font-sans",
  });

  // Rubric scores (0-3) for each subcriterion; organized by rubric
  const initialRubric = {
    diseño: { fondo: 3, tipografia: 3, sintesis: 3 },
    estructura: { titulo: 3, introduccion: 3, metodologia: 3, resultados: 3, referencias: 3 },
    exposicion: { dominio: 3, volumen: 3, diccion: 3, ritmo: 3 },
  };
  const [rubric, setRubric] = useState(initialRubric);

  function setScore(section, key, value) {
    setRubric((r) => ({ ...r, [section]: { ...r[section], [key]: Number(value) } }));
  }

  function totalScore() {
    let sum = 0;
    Object.values(rubric).forEach((sec) => Object.values(sec).forEach((v) => (sum += Number(v)));
    return sum; // max 36
  }

  // Small mock "export" that builds a downloadable JSON for preview
  function downloadPoster() {
    const blob = new Blob([JSON.stringify({ poster, rubric }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cartel_voces_visuales_${poster.title || 'sin_titulo'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">VV</div>
            <div>
              <h1 className="text-lg font-semibold">Voces Visuales — Prototipo</h1>
              <p className="text-sm text-gray-500">Plataforma de creación y evaluación de carteles</p>
            </div>
          </div>
          <nav className="flex gap-2">
            <button onClick={() => setView('landing')} className="px-3 py-2 rounded-md hover:bg-gray-100">Inicio</button>
            <button onClick={() => setView('editor')} className="px-3 py-2 rounded-md hover:bg-gray-100">Crear cartel</button>
            <button onClick={() => setView('rubric')} className="px-3 py-2 rounded-md hover:bg-gray-100">Rúbrica</button>
            <button onClick={() => setView('jury')} className="px-3 py-2 rounded-md hover:bg-gray-100">Jurado</button>
            <button onClick={() => setView('present')} className="px-3 py-2 rounded-md hover:bg-gray-100">Exposición</button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {view === 'landing' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold">Bienvenido</h2>
              <p className="mt-3 text-gray-600">Este prototipo muestra la conversión de la rúbrica del concurso "Voces visuales contra el cáncer" en flujos interactivos. Usa el menú superior para navegar entre secciones.</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setView('editor')} className="px-4 py-2 bg-blue-600 text-white rounded">Crear cartel</button>
                <button onClick={() => setView('rubric')} className="px-4 py-2 border rounded">Ver rúbrica</button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-medium">Estado actual del cartel</h3>
              <div className="mt-4 space-y-2">
                <div><strong>Título:</strong> {poster.title || <span className="text-gray-400">(sin título)</span>}</div>
                <div><strong>Introducción:</strong> {poster.introduction ? poster.introduction.slice(0, 80) + (poster.introduction.length>80?'...':'') : <span className="text-gray-400">(vacía)</span>}</div>
                <div><strong>Puntuación (estimada):</strong> {totalScore()} / 36</div>
              </div>
              <div className="mt-4">
                <button onClick={downloadPoster} className="px-3 py-2 bg-green-600 text-white rounded">Exportar (mock)</button>
              </div>
            </div>
          </section>
        )}

        {view === 'editor' && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow space-y-4">
              <h2 className="text-lg font-semibold">Editor del cartel</h2>

              <label className="block">
                <span className="text-sm font-medium">Título (máx 21 palabras)</span>
                <input
                  value={poster.title}
                  onChange={(e) => setPoster({ ...poster, title: e.target.value })}
                  className="mt-1 block w-full rounded border px-3 py-2"
                  placeholder="Escribe el título del cartel"
                />
                <p className="text-xs text-gray-500 mt-1">Palabras: {poster.title.trim() ? poster.title.trim().split(/\s+/).length : 0}</p>
              </label>

              <label className="block">
                <span className="text-sm font-medium">Introducción</span>
                <textarea
                  value={poster.introduction}
                  onChange={(e) => setPoster({ ...poster, introduction: e.target.value })}
                  className="mt-1 block w-full rounded border px-3 py-2 min-h-[90px]"
                />
                <p className="text-xs text-gray-500 mt-1">Consejo: incluye antecedentes, relevancia y objetivo.</p>
              </label>

              <label className="block">
                <span className="text-sm font-medium">Metodología (términos de búsqueda y bases de datos)</span>
                <textarea
                  value={poster.methodology}
                  onChange={(e) => setPoster({ ...poster, methodology: e.target.value })}
                  className="mt-1 block w-full rounded border px-3 py-2 min-h-[80px]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Resultados, discusión y conclusión</span>
                <textarea
                  value={poster.results}
                  onChange={(e) => setPoster({ ...poster, results: e.target.value })}
                  className="mt-1 block w-full rounded border px-3 py-2 min-h-[120px]"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium">Referencias (APA o Vancouver). Puedes generar un código QR en la app final.</span>
                <textarea
                  value={poster.references}
                  onChange={(e) => setPoster({ ...poster, references: e.target.value })}
                  className="mt-1 block w-full rounded border px-3 py-2 min-h-[80px]"
                />
              </label>

            </div>

            <aside className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold">Diseño rápido</h3>
              <div className="mt-3">
                <label className="block mb-2">Fondo</label>
                <div className="flex gap-2">
                  <button onClick={() => setPoster({ ...poster, bgColor: 'bg-white' })} className="p-3 border rounded">Claro</button>
                  <button onClick={() => setPoster({ ...poster, bgColor: 'bg-gray-900 text-white' })} className="p-3 border rounded">Oscuro</button>
                </div>
              </div>

              <div className="mt-4">
                <label className="block mb-2">Fuente</label>
                <select value={poster.font} onChange={(e) => setPoster({ ...poster, font: e.target.value })} className="w-full border rounded px-2 py-1">
                  <option value="font-sans">Sans</option>
                  <option value="font-serif">Serif</option>
                  <option value="font-mono">Mono</option>
                </select>
              </div>

              <div className="mt-6">
                <h4 className="font-medium">Previsualización</h4>
                <div className={`mt-3 p-4 rounded shadow-sm border ${poster.bgColor} ${poster.font}`}>
                  <h4 className="text-lg font-bold">{poster.title || 'Título del cartel'}</h4>
                  <p className="text-sm mt-2">{poster.introduction ? poster.introduction.slice(0, 120) + (poster.introduction.length>120?'...':'') : 'Introducción breve'}</p>
                </div>
              </div>

            </aside>
          </section>
        )}

        {view === 'rubric' && (
          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold">Rúbrica y checklist</h2>
            <p className="text-sm text-gray-500 mt-1">Ajusta las puntuaciones para ver el total. (0-3 por criterio)</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded">
                <h3 className="font-medium">I. Diseño y formato</h3>
                <label className="block mt-2 text-sm">Fondo y contraste
                  <input type="range" min="0" max="3" value={rubric.diseño.fondo} onChange={(e)=>setScore('diseño','fondo',e.target.value)} className="w-full" />
                  <div className="text-xs mt-1">{rubric.diseño.fondo} puntos</div>
                </label>
                <label className="block mt-2 text-sm">Tipografía y claridad
                  <input type="range" min="0" max="3" value={rubric.diseño.tipografia} onChange={(e)=>setScore('diseño','tipografia',e.target.value)} className="w-full" />
                  <div className="text-xs mt-1">{rubric.diseño.tipografia} puntos</div>
                </label>
                <label className="block mt-2 text-sm">Síntesis y redacción
                  <input type="range" min="0" max="3" value={rubric.diseño.sintesis} onChange={(e)=>setScore('diseño','sintesis',e.target.value)} className="w-full" />
                  <div className="text-xs mt-1">{rubric.diseño.sintesis} puntos</div>
                </label>
              </div>

              <div className="p-4 border rounded">
                <h3 className="font-medium">II. Estructura y contenido</h3>
                {Object.keys(rubric.estructura).map(k=> (
                  <label key={k} className="block mt-2 text-sm">{k}
                    <input type="range" min="0" max="3" value={rubric.estructura[k]} onChange={(e)=>setScore('estructura',k,e.target.value)} className="w-full" />
                    <div className="text-xs mt-1">{rubric.estructura[k]} puntos</div>
                  </label>
                ))}
              </div>

              <div className="p-4 border rounded">
                <h3 className="font-medium">III. Exposición oral</h3>
                {Object.keys(rubric.exposicion).map(k=> (
                  <label key={k} className="block mt-2 text-sm">{k}
                    <input type="range" min="0" max="3" value={rubric.exposicion[k]} onChange={(e)=>setScore('exposicion',k,e.target.value)} className="w-full" />
                    <div className="text-xs mt-1">{rubric.exposicion[k]} puntos</div>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm">Puntuación total:</p>
                <div className="text-2xl font-bold">{totalScore()} / 36</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>alert('PDF de reporte (mock) generado')} className="px-4 py-2 bg-indigo-600 text-white rounded">Generar reporte (PDF)</button>
                <button onClick={()=>{ setRubric(initialRubric); }} className="px-4 py-2 border rounded">Reset</button>
              </div>
            </div>
          </section>
        )}

        {view === 'jury' && (
          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold">Panel del jurado</h2>
            <p className="text-sm text-gray-500">Cada jurado puede subir su calificación. En una app real los formularios serían individuales y autenticados.</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h4 className="font-medium">Jurado 1</h4>
                <p className="text-xs text-gray-500">Formulario rápido</p>
                {/* simple quick inputs mirroring rubric */}
                {Object.entries(rubric).map(([section, items])=> (
                  <div key={section} className="mt-3">
                    <div className="text-sm font-semibold capitalize">{section}</div>
                    {Object.keys(items).map(k=> (
                      <div key={k} className="flex items-center gap-2 mt-2">
                        <div className="w-28 text-sm">{k}</div>
                        <select value={rubric[section][k]} onChange={(e)=>setScore(section,k,e.target.value)} className="border rounded px-2 py-1">
                          <option value={0}>0</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                        </select>
                      </div>
                    ))}
                  </div>
                ))}

              </div>

              <div className="p-4 border rounded">
                <h4 className="font-medium">Comentarios públicos</h4>
                <textarea className="w-full min-h-[140px] border rounded px-3 py-2" placeholder="Comentarios y recomendaciones del jurado" />
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-2 bg-blue-600 text-white rounded">Enviar</button>
                  <button className="px-3 py-2 border rounded">Guardar borrador</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'present' && (
          <section className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold">Simulador de exposición</h2>
            <p className="text-sm text-gray-500">Graba un ensayo (mock). La versión final integrará análisis de voz y detección de muletillas.</p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded">
                <h4 className="font-medium">Grabador</h4>
                <p className="text-xs">(En este prototipo el control es simulado)</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={()=>alert('Iniciando grabación (mock)')} className="px-3 py-2 bg-green-600 text-white rounded">Grabar</button>
                  <button onClick={()=>alert('Deteniendo grabación (mock)')} className="px-3 py-2 border rounded">Detener</button>
                </div>
                <div className="mt-4">
                  <label className="block text-sm">Velocidad estimada (ppm)</label>
                  <input type="range" min="80" max="200" defaultValue={140} className="w-full" />
                </div>
              </div>

              <div className="p-4 border rounded">
                <h4 className="font-medium">Retroalimentación</h4>
                <ul className="mt-2 list-disc ml-5 text-sm text-gray-700">
                  <li>Dominio del tema: Excelente</li>
                  <li>Volumen y tono: Adecuado</li>
                  <li>Claridad y dicción: Requiere pequeñas mejoras</li>
                  <li>Ritmo y pausas: Buen control</li>
                </ul>
                <div className="mt-4">
                  <button className="px-3 py-2 bg-indigo-600 text-white rounded">Generar recomendación</button>
                </div>
              </div>
            </div>
          </section>
        )}

      </main>

      <footer className="bg-white mt-6 py-4">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">Prototipo — Rúbrica: Concurso "Voces visuales contra el cáncer" • Fecha de referencia: 07 Oct 2025</div>
      </footer>
    </div>
  );
}
