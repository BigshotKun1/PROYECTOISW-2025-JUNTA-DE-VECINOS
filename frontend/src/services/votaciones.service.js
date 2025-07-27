import axios from './root.service.js';

export async function getVotaciones() {
  const usuario = JSON.parse(sessionStorage.getItem('usuario'));
  const token = usuario?.token;
  const res = await fetch('/api/votaciones', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error al obtener votaciones');
  const datav = await res.json();
  console.log("Votaciones recibidas:", datav.votaciones); // <-- Aquí sí existe
  return datav.votaciones;
}

export async function crearVotacion(data) {
  const usuario = JSON.parse(sessionStorage.getItem('usuario'));
  const token = usuario?.token;
  const res = await fetch('/api/votaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...data,
      id_usuario: usuario?.id_usuario
    })
  });
  if (!res.ok) throw new Error('Error al crear la votación');
  return await res.json();
}