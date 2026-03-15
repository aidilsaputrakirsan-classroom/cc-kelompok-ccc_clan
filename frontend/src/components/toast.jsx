import { useEffect } from "react"

function Toast({ message, type, onClose, top = 20 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const styles = {
    container: {
      position: "fixed",
      top: `${top}px`,
      right: "20px",
      zIndex: 1000,
      padding: "12px 16px",
      borderRadius: "8px",
      color: "white",
      fontWeight: "bold",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      animation: "slideIn 0.3s ease-out",
      maxWidth: "300px",
      wordWrap: "break-word",
    },
    success: {
      backgroundColor: "#28a745",
    },
    error: {
      backgroundColor: "#dc3545",
    },
  }

  return (
    <div style={{ ...styles.container, ...styles[type] }}>
      {message}
    </div>
  )
}

export default Toast
