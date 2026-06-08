import { useState,useEffect, useTransition } from 'react'

function App() {
  //Estaado que guarda las citas que vienen del backend
  const [citas, setCitas] = useState([]) 
  const [citasCargando, setCitasCargando] = useState(true)

  //Estados para el formulario
  const[cliente,setCliente] = useState('')
  const[servicio,setServicio] = useState('')
  const[hora,setHora] = useState('')

  //Funcion que hac ela peticion HTTP al backend
  const obtenerCitas = async ()=>{
    try {
      const respuesta = await fetch('http://localhost:5000/api/citas')
      const datos = await respuesta.json()
      setCitas(datos)//Aqui se guardan las citas en el estado
      setCitasCargando(false)
    } catch (error) {
      console.error("Error al conectarse con el Backend:", error)
      setCitasCargando(false)
    }
  }

  //Funcion para enviar citas al backend
  const manejarEnvio = async(e)=> {
    e.preventDefault()

    if(!cliente || !servicio || !hora){
      alert("Por favor llene todos los campos")
      return
    }

    const nuevaCita = {cliente,servicio,hora}

    try {
      const respuesta = await fetch('http://localhost:5000/api/citas',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaCita)
      })

      if(respuesta.ok){
        //Si el backend guarda la cita con exito refrescamos la lista
        obtenerCitas()
        //Limpiamos los campos del formulario
        setCliente('')
        setServicio('')
        setHora('')
      }
    } catch (error) {
      console.error("Error al registrar la cita",error)
    }
  }


  useEffect(()=>{
    obtenerCitas()
  },[])

  return (
    <>
    <div className='min-h-screen bg-gray-100 p-8 font-sans'>
      <div className='max-w-4xl mx-auto'>
        <header className='mb-8 text-center'>
          <h1 className='text-4xl font-bold text-indigo-600'>Sistema de Citas</h1>
          <p className='text-gray-600 mt-2'>Panel de administracion local</p>
        </header>

        <div className='grid gap-6 md:grid-cols-3'>

          <div className='bg-white p-6 rounded-lg shadow-md md:col-span-1 h-fit'>
            <h2 className='text-xl font-semibold mb-4 text-gray-800'>Agendar Citas</h2>
            <form onSubmit={manejarEnvio} className='space-y-4'>
              <div>
                <label className='block- text-sm font-medium text-gray-700'>Cliente</label>
                <input type="text"
                value={cliente}
                onChange={(e)=> setCliente(e.target.value)}
                placeholder='Nombre del Cliente'
                className='mt-1 block w-full rounded-md  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 bg-gray-50 border'/>
              </div>

              <div>
                <label className='block- text-sm font-medium text-gray-700'>Servicios</label>
                <input type="text"
                value={servicio}
                onChange={(e)=> setServicio(e.target.value)}
                placeholder='Ej. Corte, Uñas'
                className='mt-1 block w-full rounded-md  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 bg-gray-50 border'/>
              </div>

              <div>
                <label className='block- text-sm font-medium text-gray-700'>Hora</label>
                <input type="text"
                value={hora}
                onChange={(e)=> setHora(e.target.value)}
                placeholder='Ej. 2:30PM'
                className='mt-1 block w-full rounded-md  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 bg-gray-50 border'/>
              </div>
              <button 
              type='submit'
              className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium'>
                Guardar Cita
              </button>
            </form>
          </div>


          {/*Seccion de Citas */}
          <div className='bg-white p-6 rounded-lg shadow-md md:col-span-2'>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Citas Programadas</h2>

            {citasCargando ? (
              <p className="text-gray-500">Cargando Citas...</p>
            ): !Array.isArray(citas) || citas.length === 0 ? (
              <p className="text-gray-500">No hay citas registradas para hoy.</p>
            ):(
              <div className='grid gap-4 md:grid-col'>
                {citas.map((cita)=>(
                  <div key={cita.id} className='border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg shadow-md'>
                    <p className='font-bold text-gray-900 text-lg'>{cita.cliente}</p>
                    <p className='text-sm text-gray-700 mt-1'> <span className='font-semibold'>Servicio: </span>{cita.servicio}</p>
                    <p className='text-sm text-indigo-600 font-medium mt-2'>{cita.hora}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        

      </div>
    </div>
    </>
  )
}

export default App
