import { useState } from 'react';
import { aTexto, hoyTexto } from '../utils/fechas';
import './RangoFechas.css';

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

// calendario doble. Se usa para buscar, para reservar y (soloLectura) para ver la disponibilidad
function RangoFechas({ inicio = '', fin = '', onChange, ocupadas = [], soloLectura = false }) {
  const [mes, setMes] = useState(() => {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  });
  const [aviso, setAviso] = useState('');
  const hoy = hoyTexto();

  const cambiarMes = (cantidad) => setMes(new Date(mes.getFullYear(), mes.getMonth() + cantidad, 1));

  const elegirDia = (fecha) => {
    setAviso('');

    // primer click, o se vuelve a empezar
    if (!inicio || fin || fecha <= inicio) {
      onChange(fecha, '');
      return;
    }

    // el rango no puede tener dias ocupados (las fechas son texto yyyy-MM-dd, se pueden comparar asi)
    if (ocupadas.some((o) => o >= inicio && o <= fecha)) {
      setAviso('Ese rango incluye días ocupados, elegí otras fechas.');
      onChange(fecha, '');
      return;
    }

    onChange(inicio, fecha);
  };

  const dibujarMes = (primerDia) => {
    const anio = primerDia.getFullYear();
    const nroMes = primerDia.getMonth();
    const totalDias = new Date(anio, nroMes + 1, 0).getDate();
    const celdas = [];

    // huecos para que el dia 1 caiga en el dia de la semana correcto
    for (let i = 0; i < primerDia.getDay(); i++) {
      celdas.push(<span key={`v${i}`}></span>);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const fecha = aTexto(anio, nroMes, dia);
      const ocupado = ocupadas.includes(fecha);
      const pasado = fecha < hoy;

      let clase = 'rf-dia ' + (ocupado ? 'ocupado' : pasado ? 'pasado' : 'libre');
      if (fecha === inicio || fecha === fin) clase += ' elegido';
      else if (inicio && fin && fecha > inicio && fecha < fin) clase += ' en-rango';

      celdas.push(
        <button
          type="button"
          key={fecha}
          className={clase}
          disabled={ocupado || pasado || soloLectura}
          onClick={() => elegirDia(fecha)}
        >
          {dia}
        </button>
      );
    }

    return (
      <div className="rf-mes" key={`${anio}-${nroMes}`}>
        <h4>{MESES[nroMes]} {anio}</h4>
        <div className="rf-semana">
          {DIAS.map((d) => <span key={d}>{d}</span>)}
        </div>
        <div className="rf-dias">{celdas}</div>
      </div>
    );
  };

  const mesSiguiente = new Date(mes.getFullYear(), mes.getMonth() + 1, 1);

  return (
    <div className={`rf ${soloLectura ? 'rf-lectura' : ''}`}>
      <div className="rf-nav">
        <button type="button" onClick={() => cambiarMes(-1)} title="Mes anterior">‹</button>
        <button type="button" onClick={() => cambiarMes(1)} title="Mes siguiente">›</button>
      </div>

      <div className="rf-meses">
        {dibujarMes(mes)}
        {dibujarMes(mesSiguiente)}
      </div>

      {aviso && <p className="rf-aviso">⚠️ {aviso}</p>}

      {soloLectura ? (
        <div className="rf-leyenda">
          <span><i className="punto libre"></i> Disponible</span>
          <span><i className="punto ocupado"></i> Reservado</span>
        </div>
      ) : (
        <p className="rf-resumen">
          Check-in: <strong>{inicio || '-'}</strong> &nbsp;|&nbsp; Check-out: <strong>{fin || '-'}</strong>
        </p>
      )}
    </div>
  );
}

export default RangoFechas;
