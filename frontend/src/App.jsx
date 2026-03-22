import { useState, useEffect, useCallback } from "react"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import LoginPage from "./components/LoginPage"
import {
  fetchItems, createItem, updateItem, deleteItem,
  checkHealth, login, register, clearToken,
} from "./services/api"

function App() {
  // ==================== AUTH STATE ====================
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ==================== APP STATE ====================
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [notification, setNotification] = useState(null)
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  // ==================== NOTIFICATION ====================
  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
  
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  // ==================== LOAD DATA ====================
  const loadItems = useCallback(async (search = "") => {
    setLoading(true)
    try {
      const data = await fetchItems(search)
      setItems(data.items)
      setTotalItems(data.total)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        handleLogout()
      }
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkHealth().then(setIsConnected)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadItems()
    }
  }, [isAuthenticated, loadItems])

  // ==================== AUTH HANDLERS ====================

  const handleLogin = async (email, password) => {
    const data = await login(email, password)
    setUser(data.user)
    setIsAuthenticated(true)
  }

  const handleRegister = async (userData) => {
    try {
      // Register lalu otomatis login
      await register(userData)
      await handleLogin(userData.email, userData.password)
    } catch (err) {
      // paksa error jadi string yang aman
      if (err instanceof Error) {
        throw err
      } else if (typeof err === "object") {
        throw new Error(err?.message || err?.detail || "Register gagal")
      } else {
        throw new Error("Register gagal")
      }
    }
  }

  const handleLogout = () => {
    clearToken()
    setUser(null)
    setIsAuthenticated(false)
    setItems([])
    setTotalItems(0)
    setEditingItem(null)
    setSearchQuery("")
  }

  // ==================== ITEM HANDLERS ====================

  const handleSubmit = async (itemData, editId) => {
    setLoadingSubmit(true) // ⬅️ START loading
    try {
      if (editId) {
        await new Promise(resolve => setTimeout(resolve, 1500)) // delay 1.5 detik
        await updateItem(editId, itemData)
        showNotification("Item berhasil diupdate")
        setEditingItem(null)
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500)) // delay 1.5 detik
        await createItem(itemData)
        showNotification("Item berhasil ditambahkan")
      }
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else showNotification(err.message, "error")
    } finally {
      setLoadingSubmit(false) // ⬅️ STOP loading
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id)
    if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return
    try {
      await deleteItem(id)
      showNotification("Item berhasil dihapus")
      loadItems(searchQuery)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") handleLogout()
      else showNotification(err.message, "error")
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadItems(query)
  }


  // ==================== RENDER ====================

  // Jika belum login, tampilkan login page
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
  }

  // Jika sudah login, tampilkan main app
  return (
    <div style={styles.app}>
      <div style={styles.container}>
      {notification && (
      <div
        style={{
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "6px",
          color: "white",
          backgroundColor:
            notification.type === "error" ? "#e74c3c" : "#2ecc71",
          textAlign: "center",
        }}
      >
        {notification.message}
      </div>
      )}
        <Header
          totalItems={totalItems}
          isConnected={isConnected}
          user={user}
          onLogout={handleLogout}
        />
        <ItemForm
          onSubmit={handleSubmit}
          editingItem={editingItem}
          onCancelEdit={() => setEditingItem(null)}
          loading={loadingSubmit}
        />
        <SearchBar onSearch={handleSearch} />
        <ItemList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  )
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "2rem",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  container: { maxWidth: "900px", margin: "0 auto" },
}

export default App