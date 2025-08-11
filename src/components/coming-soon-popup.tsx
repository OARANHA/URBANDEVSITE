"use client"

import * as React from "react"
import { Sparkles, Clock, Star, Zap } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/popup"

interface ComingSoonPopupProps {
  trigger: React.ReactNode
  title?: string
  description?: string
}

export function ComingSoonPopup({ 
  trigger, 
  title = "��� Em Breve!", 
  description = "Estamos trabalhando arduamente para trazer algo incrível. Fique ligado para não perder a grande revelação!"
}: ComingSoonPopupProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-700 bg-clip-text text-transparent">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 dark:text-gray-300 mt-4">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Estamos quase lá...</span>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500/10 to-blue-700/10 rounded-lg p-4 border border-orange-200/50 dark:border-blue-800/50">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <span className="font-medium text-orange-700 dark:text-orange-300">Novidades em breve</span>
            </div>
            <p className="text-sm text-center text-gray-600 dark:text-gray-300">
              Em breve, teremos recursos exclusivos para novos clientes que vão revolucionar sua experiência.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-orange-500" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Inovação</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Performance</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">Exclusividade</span>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-center text-blue-700 dark:text-blue-300">
              ��� <strong>Fique de olho!</strong> Em breve lançaremos uma experiência incrível que vai mudar o jeito que você trabalha.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
