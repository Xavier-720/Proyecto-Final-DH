import logo from '../assets/Anteiku_Stay_redondo.png';
import './Footer.css';

// US#7: footer con el isologotipo, el año y el copyright
function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-brand">
        <div className="footer-logo-row">
          <img src={logo} alt="Anteiku Stay" className="footer-logo-img" />
          <span className="footer-title">Anteiku</span>
        </div>
        <p className="footer-copy">© {anio} Anteiku Stays. Todos los derechos reservados.</p>
      </div>

      <div className="footer-info">
        <span>Sentite como en tu hogar</span>
      </div>
    </footer>
  );
}

export default Footer;
