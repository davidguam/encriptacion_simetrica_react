import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_AES_SECRET_KEY;

function TransaccionList() {
  const [transacciones, setTransacciones] = useState([]);

  // Función para desencriptar un texto AES/CBC con IV
  const desencriptar = (textoCifrado, ivBase64) => {
    const clave = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Base64.parse(ivBase64);

    const decrypted = CryptoJS.AES.decrypt(
      textoCifrado,
      clave,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  };

  useEffect(() => {
    const fetchTransacciones = async () => {
      const endpoint = `${process.env.REACT_APP_API_URL}/transacciones`;
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();

          // Desencriptar los campos sensibles
          const dataDesencriptada = data.map((t) => ({
            ...t,
            cuentaRemitente: desencriptar(t.cuentaRemitente, t.ivCuentaRemitente),
            cuentaDestinatario: desencriptar(t.cuentaDestinatario, t.ivCuentaDestinatario),
          }));

          setTransacciones(dataDesencriptada);
        } else {
          console.error("Error al obtener transacciones");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTransacciones();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lista de Transacciones</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Remitente</th>
              <th>Destinatario</th>
              <th>Monto</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((transaccion) => (
              <tr key={transaccion.id}>
                <td>{transaccion.id}</td>
                <td>{transaccion.cuentaRemitente}</td>
                <td>{transaccion.cuentaDestinatario}</td>
                <td>{transaccion.monto}</td>
                <td>{transaccion.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransaccionList;
