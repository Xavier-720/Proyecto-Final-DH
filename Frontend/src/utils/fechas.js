// arma un texto yyyy-MM-dd (el mes va de 0 a 11)
export const aTexto = (anio, mes, dia) =>
  `${anio}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

export const hoyTexto = () => {
  const hoy = new Date();
  return aTexto(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
};
