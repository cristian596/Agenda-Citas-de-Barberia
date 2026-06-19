import React, { useEffect, useState } from 'react'

const VistaBarbero = () => {
  const[citas,setCitas] = useState([])
  const [citasCargando, setCitasCargando] = useState(true)

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
          <div className='flex flex-col justify-center items-center p-2'>
            {citasCargando ? (
              <p className="text-gray-500">Cargando Citas...</p>
            ):!Array.isArray(citas) || citas.length === 0 ? (
                <p className="text-gray-500">No hay citas registradas para hoy.</p>
            ):(
              <div className='grid grid-cols-2'>
                {citas.map((cita)=>{
                  return(
                    <div className='grid grid-cols-2 m-2 border'>
                      <div key={cita.id} className='flex flex-col gap-1 p-2 border-l-4 border-indigo-500'>
                        <p className='text-lg font-bold'>{cita.cliente}</p>
                        <p className='text-lg text-gray-700'><span className='font-semibold'>Servicio: </span>{cita.servicio}</p>
                        <p className='text-sm text-indigo-600 font-bold' >{cita.fecha} {cita.hora}</p>
                      </div>
                    </div>
                  ) 
                })
                }
              </div>
            )
          }
          </div>
        </div>
      </div> 
    </div>
    </>
  )
}

export default VistaBarbero
