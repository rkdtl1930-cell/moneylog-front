import { create } from "zustand"
import { persist } from "zustand/middleware"

export const SET_CURRENT_USER = 'SET_CURRENT_USER'
export const CLEAR_CURRENT_USER = 'CLEAR_CURRENT_USER'

const useUserStore = create(
  persist(
    (set)=>({
      user : null,
      setCurrentUser : (user)=>
        set({
          user,
          lastAction:SET_CURRENT_USER
        }),
        clearCurrentUser:()=>
          set({
            user:null,
            lastAction:CLEAR_CURRENT_USER
          })
    }),
    {name : 'currentUser'}
  )
)
export default useUserStore