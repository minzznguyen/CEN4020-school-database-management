import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { getFirestore, doc, setDoc, collection, query, getDocs, orderBy, limit } from "firebase/firestore";
// import { app } from '../firebaseConfig';
import axios from 'axios';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // const generateNewId = async (collectionName) => {
  //   const db = getFirestore(app);
  //   const collectionRef = collection(db, collectionName);
    
  //   const snapshot = await getDocs(query(collectionRef, orderBy('studentId', 'desc'), limit(1)));
    
  //   if (snapshot.empty) {
  //     return "1";
  //   }
    
  //   const highestId = snapshot.docs[0].data().studentId;
  //   return (parseInt(highestId) + 1).toString();
  // };

  const validatePassword = (password) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const { firstName, lastName, email, role, password, confirmPassword } = formData;
  
      // Validations
      if (password !== confirmPassword) {
        alert("Passwords don't match");
        setIsLoading(false);
        return;
      }
  
      if (!validatePassword(password)) {
        alert('Password must be at least 8 characters long and contain uppercase, lowercase, and numbers');
        setIsLoading(false);
        return;
      }
  
      if (!acceptTerms) {
        alert("Please accept the Terms and Conditions");
        setIsLoading(false);
        return;
      }
  
      if (!role) {
        alert("Please select a role");
        setIsLoading(false);
        return;
      }
  
      // // Call Firebase Auth to create a user
      // const auth = getAuth(app);
      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;
  
      // Prepare data for the backend
      let newData = {};

      let endpoint = '';
      switch (role) {
        case 'student':
          newData = {name: `${firstName} ${lastName}`, majorId: '1'};
          endpoint = 'http://localhost:3000/students/';
          break;
        case 'instructor':
          newData = {name: `${firstName} ${lastName}`, departmentId: '1'};
          endpoint = 'http://localhost:3000/instructors/';
          break;
        // case 'staff':
        //   newData = {name, departmentId: ['1']};
        //   endpoint = 'http://localhost:3000/staff/';
        //   break;
        case 'advisor':
          newData = {AdvisorId: '1', name: `${firstName} ${lastName}`, departments: ['1']};
          endpoint = 'http://localhost:3000/advisors/';  
          break;
        default:
          throw new Error("Invalid role specified");
      }
      
      // Define the endpoint based on the role
  
      // Make the POST request
      console.log(newData);
      const response = await axios.post(endpoint, newData);
  
      if (response.status === 201) {
        alert('Account created successfully');
        navigate('/');
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.message || 'An error occurred.');
      } else {
        alert(error.message || 'An error occurred while creating your account.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          School Database
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="John"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Doe"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Select your role
                </label>
                <select
                  name="role"
                  id="role"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="">Select role</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="staff">Staff</option>
                  <option value="advisor">Advisor</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                    I accept the{' '}
                    <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create an account'}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateAccount;