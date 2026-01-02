import React from 'react'
import LoginPage from './components/LoginPage/LoginPage'
import Dashboard from './components/Dashboard/Dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Products from './components/Products/Products'
import AddProducts from './components/AddProducts/AddProducts'
import AddCollections from './components/AddCollections/AddCollections'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import EditProduct from './components/EditProduct/EditProduct.jsx'
const App = () => {
  return (
   <BrowserRouter basename="/admin">
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path='/products' element={<Products />} />
      <Route path="/products/add" element={<AddProducts />} />
      <Route path="/collections/add" element={<AddCollections />} />
      <Route path="/products/edit/:id" element={<EditProduct />} />
      </Route>
    </Routes>
   </BrowserRouter>
  )
}

export default App