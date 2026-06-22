import { useState,useEffect, useTransition } from 'react'
import { useNavigate } from 'react-router';


const Horas_Disponibles = [
  { value: "08:00", label: "08:00 AM" },
  { value: "09:00", label: "09:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "16:00", label: "04:00 PM" },
  { value: "17:00", label: "05:00 PM" },
  { value: "18:00", label: "06:00 PM" },
];

const Servicios_Hombres = [
  "Corte de Cabello",
  "Corte de Barba",
  "Combo (Pelo + Barba)",
  "Perfilado de Cejas",
  "Exfoliación Facial",
  "Uñas"
];

const Servicios_Mujeres = [
  "Corte + Cepillado",
  "Tintura Completa",
  "Keratina / Alisado",
  "Hidratación Profunda",
  "Peinado de Fiesta / Ondas",
  "Manicure + Pedicure",
  "Diseño de Cejas + Bozo",
  "Maquillaje Profesional"
];

const VistaCliente = () => {
      //Estado que guarda las citas que vienen del backend
      const [citas, setCitas] = useState([]) 
      const [citasCargando, setCitasCargando] = useState(true)
    
      //Estados para el formulario
      const[cliente,setCliente] = useState('')
      const[servicio,setServicio] = useState('')
      const[hora,setHora] = useState('')
    
      //Estados de las fechas
      const fechaHoy = new Date().toISOString().split('T')[0];
      const [fecha, setFecha] = useState(fechaHoy)

      //Funcion para moverse entre componentes 
      const navigate = useNavigate()
    
      //Funcion que hace la peticion HTTP al backend
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
  
      //Mensaje para la ventana de barberos
      const eventClick = () =>{
        if(!window.confirm("Este apartado es solo para los barberos")){
          return;
        }

        navigate("/barbero")
      }

      //Funcion para enviar citas al backend
      const manejarEnvio = async(e)=> {
        e.preventDefault()
    
        if(!cliente || !servicio || !fecha || !hora){
          alert("Por favor llene todos los campos y selecione la hora")
          return
        }
    
        const nuevaCita = {cliente,servicio, fecha, hora}
    
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
    
      //Formatear fecha de las citas 
      const formatearHora = (hora24) => {
        const [hora, minuto] = hora24.split(":").map(Number);

        const periodo = hora >= 12 ? "PM" : "AM";
        const hora12 = hora % 12 || 12;

        return `${hora12.toString().padStart(2, "0")}:${minuto
          .toString()
          .padStart(2, "0")} ${periodo}`;
      };
      //Funcion para eliminar citas del backend
      const eliminarCitas = async (id) =>{
        //Confirmacion para evitar clicks erroneos
        if(!window.confirm("¿Estás seguro de que deseas cancelar esta cita?")){
          return;
        }
    
        try {
          const respuesta = await fetch(`http://localhost:5000/api/citas/${id}`,{
            method: 'DELETE'
          });
    
          if (respuesta.ok){
            //Si el backend lo borro con exito, volvemos a pedir las citas para refrescar la pagina
            obtenerCitas();
          }else{
            alert("Hubo un error al intentar eliminar la cita.")
          }
        } catch (error) {
          console.error("Error al conectar con el servidor para eliminar:", error);
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
              <button className='border cursor-pointer p-2 rounded-xl text-xl active:scale-95 duration-300 mt-2'
              onClick={eventClick}>✂️ Agenda Barbero</button>
            </header>
    
            <div className='grid gap-6 md:grid-cols-6'>
    
              <div className='bg-white p-6 rounded-lg shadow-md md:col-span-3 h-fit'>
                <h2 className='text-xl font-semibold mb-4 text-gray-800'>Agendar Citas</h2>
                <form onSubmit={manejarEnvio} className='space-y-4'>
                  <div>
                    <label className='block- text-sm font-medium text-gray-700'>Cliente
    
                    </label>
                    <input type="text"
                    value={cliente}
                    onChange={(e)=> setCliente(e.target.value)}
                    placeholder='Nombre del Cliente'
                    className='mt-1 block w-full rounded-md  border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 bg-gray-50 border'/>
                  </div>
    
                  {/*Servicios que pueden seleccionar */}
                  <div className='grid grid-cols-2 gap-3'>
    
                    <div>
                      <label className='block- text-sm font-medium text-gray-700'>Servicios Hombre</label>
                      <div className='grid grid-cols-2 gap-2'>
                          {Servicios_Hombres.map((serviH)=>{
                            const seleccionado = servicio === serviH
    
                            return(
                              <button
                              key={serviH}
                              type='button'
                              onClick={()=>setServicio(serviH)}
                              className={`p-2 text-sm font-medium border rounded-md transition-all cursor-pointer text-center ${
                                seleccionado 
                                ? "bg-indigo-600 text-white font-semibold transform scale-105"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-500"
                              }`}
                              >
                                {serviH}
                              </button>
                            )
                            })
                          }
                      </div>
                    </div>
    
                    <div>
                      <label className='block- text-sm font-medium text-gray-700'>Servicios Mujeres</label>
                      <div className='grid grid-cols-2 gap-2'>
                          {Servicios_Mujeres.map((serviH)=>{
                            const seleccionado = servicio === serviH
    
                            return(
                              <button
                              key={serviH}
                              type='button'
                              onClick={()=>setServicio(serviH)}
                              className={`p-2 text-sm font-medium border rounded-md transition-all cursor-pointer text-center ${
                                seleccionado 
                                ? "bg-indigo-600 text-white font-semibold transform scale-105"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50 hover:border-indigo-500"
                              }`}
                              >
                                {serviH}
                              </button>
                            )
                            })
                          }
                      </div>
                    </div>
    
                  </div>
    
                  <div>
                    <label htmlFor="" className='block text-sm font-medium mb-2 text-gray-700'>Seleccione el dia de la cita</label>
                    <input 
                    type="date" 
                    value={fecha}
                    min={fechaHoy}
                    onChange={(e)=>{
                      setFecha(e.target.value)
                      setHora('')
                    }}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500'
                    />
                  </div>
    
                  <div>
                    <label className='block- text-sm font-medium text-gray-700'>Selecciona la hora del servicio</label>
                    <div className='grid grid-cols-3 gap-2'>
                      {Horas_Disponibles.map((horaOp)=>{
                        //Verificamos si esta tarjeta es la que el ususario selecciono actualmente
                        const estaSeleccionada = hora === horaOp.value
                        //Buscamos si hay una cita con la misma fecha y hora
                        const estaOcupada = citas.some(cita => cita.fecha === fecha && cita.hora === horaOp.value)
    
                        return(
                          <button
                          key={horaOp.value}
                          type='button'
                          disabled = {estaOcupada}
                          onClick={()=> setHora(horaOp.value)}
                          className={`p-3 text-sm font-medium rounded-lg border text-center transition-all cursor-pointer ${
                            estaSeleccionada
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105"
                            : "bg-white text-gray-700 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50"
                          }`}
                          >
                            {horaOp.label}
                          </button>
                        )
                      })
                      }
                    </div>
                  </div>
                  <button 
                  type='submit'
                  className='w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium'>
                    Guardar Cita
                  </button>
                </form>
              </div>
    
    
              {/*Seccion de Citas */}
              <div className='bg-white p-6 rounded-lg shadow-md md:col-span-3'>
                <h2 className='text-2xl font-semibold mb-4 text-gray-800'>Citas Programadas</h2>
    
                {citasCargando ? (
                  <p className="text-gray-500">Cargando Citas...</p>
                ): !Array.isArray(citas) || citas.length === 0 ? (
                  <p className="text-gray-500">No hay citas registradas para hoy.</p>
                ):(
                  <div className='grid grid-cols-2 gap-4'>
                    {citas.map((cita)=>(
                      <div key={cita.id} className='border-l-4 border-indigo-500 bg-indigo-50 p-4 rounded-r-lg shadow-md'>
                        <div>
                          <p className='font-bold text-gray-900 text-lg'>{cita.cliente}</p>
                          <p className='text-sm text-gray-700 mt-1'> <span className='font-semibold'>Servicio: </span>{cita.servicio}</p>
                          <p className='text-sm text-indigo-600 font-medium mt-2'>{formatearHora(cita.hora)}</p>
                        </div>
    
                        {/*Boton para eliminar citas */}
                        <button
                        onClick={()=> eliminarCitas(cita.id)}
                        className='bg-red-100 hover:bg-red-600 text-red-600 hover:text-white p-2 rounded-lg transition-colors cursor-pointer text-sm font-medium'
                        >
                          Cancelar
                        </button>
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

export default VistaCliente
