class StateMachine {
    #stateHandlers;
    #eventHandlers;
    #transitions;
    #state;
    constructor(transitions) {
        this.#stateHandlers={};
        this.#eventHandlers={};
        this.#transitions = transitions;
        this.#state=Object.keys(this.#transitions)[0];
    }
    get state() { return this.#state; }
    get possibleStates() {
        return Object
        .keys(this.#transitions);
    }
    get events() {
        return Object
        .values(this.#transitions)
        .map(state=>Object.keys(state))
        .flat()
        .filter((value, index, array)=>(array.indexOf(value) === index));
    }
    get trigger() { 
        const self = this;
        return {
            enter(newState) {
                if (! self.#stateHandlers[newState]) return;
                const handlers = self.#stateHandlers[newState];
                for(const handler of handlers.onEnter) {
                    handler(self,newState);
                }
            },
            exit(oldState) {
                if (!self.#stateHandlers[oldState]) return;
                const handlers = self.#stateHandlers[oldState];
                for(const handler of handlers.onExit) {
                    handler(self,oldState);
                }
            },
            event(state,event) {
                if (!self.#eventHandlers[event]) return;
                const handlers = self.#eventHandlers[event];
                for(const handler of handlers) {
                    handler(self,state,event);
                }
            }
        }
    }
    get on() {
        const self = this;
        return {
            enter(state) {
                const handlers = self.#stateHandlers[state]||={onEnter:[],onExit:[]};
                return {
                    do(method) {
                        handlers.onEnter.push(method);
                    }
                }
            },
            exit(state) {
                const handlers = self.#stateHandlers[state]||={onEnter:[],onExit:[]};
                return {
                    do(method) {
                        handlers.onExit.push(method);
                    }
                }
            },
            event(event) {
                const handlers = self.#eventHandlers[event]||=[];
                return {
                    do(method) {
                        handlers[event].push(method);
                    }
                }
            }
        }
    }
    handle(event,noThrow=true) {
        const tx = this.#transitions[this.#state];
        const oldState=this.#state;
        const newState = tx[event];
        this.trigger.event(this.#state,event);
        if (!newState) {
            if(!noThrow) throw new Error("No state transition for event");
            return this;
        }
        this.trigger.exit(oldState,newState);
        this.#state=newState;
        this.trigger.enter(newState,oldState);
        
    }
}
