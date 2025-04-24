import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_AES_SECRET_KEY;

function TransaccionForm() {
  const [cuentaRemitente, setCuentaRemitente] = useState("");
  const [cuentaDestinatario, setCuentaDestinatario] = useState("");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const encriptar = (texto) => {
    const clave = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const iv = CryptoJS.lib.WordArray.random(16);

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(texto),
      clave,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return {
      texto: encrypted.toString(),
      iv: CryptoJS.enc.Base64.stringify(iv)
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const remitente = encriptar(cuentaRemitente);
    const destinatario = encriptar(cuentaDestinatario);

    const transaccionBancaria = {
      cuentaRemitente: remitente.texto,
      ivCuentaRemitente: remitente.iv,
      cuentaDestinatario: destinatario.texto,
      ivCuentaDestinatario: destinatario.iv,
      monto,
      descripcion
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/transacciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaccionBancaria),
      });

      if (response.ok) {
        const data = await response.json();
        setMensaje(`Transacción guardada con éxito! ID: ${data.id}`);
      } else {
        setMensaje("Hubo un error al guardar la transacción.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al comunicarse con el servidor.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Formulario de Transacción Bancaria</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Cuenta Remitente:</label>
          <input
            type="text"
            className="form-control"
            value={cuentaRemitente}
            onChange={(e) => setCuentaRemitente(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Cuenta Destinatario:</label>
          <input
            type="text"
            className="form-control"
            value={cuentaDestinatario}
            onChange={(e) => setCuentaDestinatario(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Monto:</label>
          <input
            type="number"
            className="form-control"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción:</label>
          <input
            type="text"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Enviar Transacción</button>
      </form>
      {mensaje && <div className="alert alert-info mt-4">{mensaje}</div>}
    </div>
  );
}

export default TransaccionForm;
