import DocHeader from '../../../Components/dashboard/doctor/DocHeader'
import DocSidebar from '../../../Components/dashboard/doctor/DocSidebar'

const AddAppointment = () => {
  return (
    <>
      <DocHeader />
      <div className="h-screen flex">
        <DocSidebar />
        <section className='flex flex-col bg-gray-100 rounded-3xl m-5 p-5 space-y-7 w-3/5'>
        Add Appointment below
        </section>
      </div>
    </>
  )
}

export default AddAppointment