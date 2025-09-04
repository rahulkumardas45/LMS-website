import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import { assets, dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState (null)
  const {currency, getToken, backendUrl, isEducator} = useContext(AppContext);

  const fetchDashboardData  = async ()=>{
      try {
        const token = await getToken();
        const {data} = await axios.get(backendUrl + '/api/educator/dashboard', {headers: {Authorization: `Bearer ${token}`}})

        if(data.success){
          setDashboardData(data.dashboardData)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
  }

  useEffect (()=>{
    if(isEducator){
       fetchDashboardData()
    }
  }, [isEducator])


  return dashboardData ? (
  <div className='min-h-screen flex flex-col items-start justify-start gap-8 md:p-8 md:pb-0 p-4  pt-4 pb-0'>
  <div className='space-y-5 '>
    <div className='flex flex-wrap gap-5 ml-8 items-center'>
      <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
        <img src={assets.patients_icon} alt="patients_icon" />
        <div>
          <p className='text-2xl font-medium text-gray-600'>{dashboardData.enrolledStudentsData.length}</p>
          <p className='text-base text-gray-500'>Total Enrolments</p>
        </div>
      </div>
      <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
        <img src={assets.appointments_icon} alt="patients_icon" />
        <div>
          <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalCourses}</p>
          <p className='text-base text-gray-500'>Total Courses</p>
        </div>
      </div>
      <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
        <img src={assets.earning_icon} alt="patients_icon" />
        <div>
          <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalEarnings}</p>
          <p className='text-base text-gray-500'>Total Earnings</p>
        </div>
      </div>
    </div>
  </div>
  <div className="container mx-auto mt-0 ml-1 sm:p-6 lg:p-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-blue-600">
        Latest Enrolments
      </h2> 
      <div className="bg-white rounded-lg ml-0 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-600 font-semibold border-b bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4">#</th>
                <th scope="col" className="px-6 py-4">Student name</th>
                <th scope="col" className="px-6 py-4">Course Title</th>
                <th scope="col" className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.enrolledStudentsData.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-600">{index + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.student.imageUrl}
                        alt={item.student.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-800">{item.student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{item.courseTitle}</td>
                  <td className="px-6 py-4 text-gray-700">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
</div>

  ): <Loading/>
}

export default Dashboard