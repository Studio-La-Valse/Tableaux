import { defineStore } from 'pinia'
import { ElementDispatcher } from '@/models/observable/element-dispatcher'
import type { DrawableElement } from '@/models/drawable-elements/drawable-element'
import type { Observer } from '@/models/observable/observer'

export const useDispatcherStore = defineStore('element-dispatcher', () => {
  const dispatcher = new ElementDispatcher()

  function subscribe(observer: Observer<DrawableElement>) {
    return dispatcher.subscribe(observer)
  }

  function registerEmitter(emitterId: string) {
    dispatcher.register(emitterId)
  }

  function queueElement(element: DrawableElement) {
    dispatcher.queue(element)
  }

  function markEmitterComplete(emitterId: string) {
    dispatcher.requestDone(emitterId)
  }

  function unregisterEmitter(emitterId: string){
    dispatcher.unregister(emitterId);
  }

  return { registerEmitter, markEmitterComplete, subscribe, queueElement, unregisterEmitter }
})
