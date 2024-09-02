"use client"

import {useContext} from "react";
import {AuthContext} from "@/contexts/auth";
import {CartContext} from "@/contexts/cart";

export const useUser = () => useContext(AuthContext)
export const useCart = () => useContext(CartContext)