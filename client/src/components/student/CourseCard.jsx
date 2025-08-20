import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext} from '../../context/AppContext';
import { Link } from 'react-router-dom';

const CourseCard = ({Course}) => {

 const {currency, calculateRating} = useContext(AppContext);


  return (
    <Link to={'/course-detail/' + Course._id}  onClick={() => scrollTo(0, 0)} className=" border border-gray-200 rounded-lg pb-6 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <img  className="w-full "  src={Course.courseThumbnail} alt="" />
      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold'>{Course.courseTitle}</h3>
        <p className='text-sm text-gray-600'>GreatStack</p>
        <div className='flex items-center space-x-2'>
          <p>{calculateRating(Course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_, i) => (
              <img key={i} src={i < Math.floor(calculateRating(Course)) ? assets.star : assets.star_blank} alt="" 
                className='w-3.5 h-3.5'/>
            ))}
          </div>
          <p className='text-sm text-gray-600'>{Course.courseRatings.length}</p>
        </div>
        <p className='text-base font-semibold text-gray-800'>{currency}{(Course.coursePrice - Course.discount * Course.coursePrice / 100).toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default CourseCard