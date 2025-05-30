import { motion, AnimatePresence } from "framer-motion"
import { AlertOctagon, X } from "lucide-react"
import { useEffect, useState } from "react"

interface ToastProps {
  message: string
}

const toastVariants = {
  initial: { opacity: 0, y: -50, scale: 0.3 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
}

export const ErrorToast: React.FC<ToastProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={toastVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed top-4 right-4 z-50 max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="flex items-center p-4">
            <div className="flex-shrink-0">
              <AlertOctagon className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">{message}</p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => setIsVisible(false)}
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="bg-red-100 px-4 py-3 sm:px-6">
            <p className="text-sm text-red-700">This error message will disappear in a few seconds.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}