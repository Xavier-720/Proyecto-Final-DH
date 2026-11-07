// Imagen que se muestra cuando un hotel no tiene foto
export const IMAGEN_POR_DEFECTO =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

// Fotos de ejemplo para la galería del detalle. Los hoteles tienen una sola imagen,
// así que las demás salen de este grupo (US#6).
const IDS_UNSPLASH = [
  '1554118811-1e0d58224f24', '1582719478250-c89cae4dc85b', '1542314831-068cd1dbfeeb',
  '1590490360182-c33d57733427', '1578683010236-d716f9a3f461', '1512917774080-9991f1c4c750',
  '1618773928121-c32242e63f39', '1591088398332-8a7791972843', '1568495248636-6432b97bd949',
  '1584132967334-10e028bd69f7', '1596394516093-501ba68a0ba6', '1445019980597-93fa8acb246c',
  '1507652313519-d4e9174996dd', '1551882547-ff40c63fe5fa', '1571896349842-33c89424de2d',
  '1520250497591-112f2f40a3f4', '1514933651103-005eec06c04b', '1533105079780-92b9be482077',
  '1566073771259-6a8506099945', '1582719508461-905c673771fd', '1519671482749-fd09be7ccebf',
  '1540555700478-4be289fbecef', '1543007630-9710e4a00a20', '1566665797739-1674de7a421a',
];

// devuelve `cantidad` imágenes distintas entre sí y distintas a la principal
export const imagenesGaleria = (hotelId, imagenPrincipal, cantidad = 4) => {
  const imagenes = [];
  for (let i = 0; imagenes.length < cantidad && i < 30; i++) {
    const id = IDS_UNSPLASH[((hotelId || 1) * 5 + i * 7) % IDS_UNSPLASH.length];
    const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=80`;
    if (url !== imagenPrincipal && !imagenes.includes(url)) imagenes.push(url);
  }
  return imagenes;
};
