import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const VistaBarbero = () => {
  const[citas,setCitas] = useState([])
  const [citasCargando, setCitasCargando] = useState(true)
  const fechaHoy = new Date().toISOString().split("T")[0]
  const [fecha, setFecha] = useState(fechaHoy)
  const navigate = useNavigate()

  //Obtenemos las citas del backend
  const obtenerCitas = async ()=>{
    try {
      const respuesta = await fetch('http://localhost:5000/api/citas')
      const datos = await respuesta.json()
      setCitas(datos)
      setCitasCargando(false)
    } catch (error) {
      console.error("Error al conectarse con el Backend:", error)
      setCitasCargando(false)
    }
  }

      //Formatear fecha de las citas 
      const formatearHora = (hora24) => {
        const [hora, minuto] = hora24.split(":").map(Number);

        const periodo = hora >= 12 ? "PM" : "AM";
        const hora12 = hora % 12 || 12;

        return `${hora12.toString().padStart(2, "0")}:${minuto
          .toString()
          .padStart(2, "0")} ${periodo}`;
      };

      //Ordenamos las citas segun su fecha
      const citasOrdenadas = [...citas].sort((a,b)=>{
        const fechaHoraA = new Date(`${a.fecha}T${a.hora}`)
        const fechaHoraB = new Date(`${b.fecha}T${b.hora}`)

        return fechaHoraA - fechaHoraB
      })

      //Realizamos un filtro de citas segun la fecha
      const citasFiltradas = fecha 
      ? citasOrdenadas.filter(cita => cita.fecha === fecha)
      : citasOrdenadas

  useEffect(()=>{
    obtenerCitas()
  },[])
  return (
    <>
    <div className='flex flex-col justify-center items-center p-10'>
      <div>
        <div className='text-center'>
          <h1 className='text-4xl text-indigo-600 mb-2 font-serif'>Citas Agendadas</h1>
          <p className='text-lg text-mauve-900 font-medium'>Cada cliente llega buscando un cambio; está en tus manos convertir ese momento en una experiencia inolvidable. ¡Haz que cada corte cuente! 💈✂️</p>
        </div>

        <div>
          <div className='flex justify-end'>
            <input
            type="date" 
            className='mt-4'
            value={fecha}
            min={fechaHoy}
            onChange={(e)=>setFecha(e.target.value)}
            />
          </div>
          <div className='flex flex-col justify-center items-center p-2'>
            {citasCargando ? (
              <p className="text-gray-500">Cargando Citas...</p>
            ):!Array.isArray(citas) || citas.length === 0 ? (
                <p className="text-gray-500">No hay citas registradas para hoy.</p>
            ):(
              

              <div>
                {citasFiltradas.length === 0 ? (
                  <p>Aun no hay citas agendadas para esta fecha</p>
                ):(
                  <div className='grid grid-cols-2'>
                  {citasFiltradas.map((cita)=>{
                  return(
                    <div key={cita.id} className='grid grid-cols-2 m-2 border'>
                      <div className={`flex flex-col gap-1 p-2 border-l-4 border-indigo-500`}>
                        <p className='text-lg font-bold'>{cita.cliente}</p>
                        <p className='text-lg text-gray-700'><span className='font-semibold'>Servicio: </span>{cita.servicio}</p>
                        <p className='text-sm text-indigo-600 font-bold'>{cita.fecha} {formatearHora(cita.hora)}</p>
                      </div>
                    </div>
                      ) 
                    })
                  }
                  </div>
                )}
              </div>
            )
          }
          </div>
        </div>
      </div> 
    </div>
    <div className='flex justify-center'>
      <button 
      onClick={()=>navigate("/")}
      className='border border-black p-2 rounded-lg bg-red-500 text-white font-bold cursor-pointer hover:bg-red-700 active:scale-95 duration-300'> Atras</button>
    </div>
    </>
  )
}

export default VistaBarbero
