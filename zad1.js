let organizer = (function ()
{
    const invId = "Invalid id.";
    let createEnable = true; 
    let person = [];
    let events = [];
    let eIndex = function (id)
	{
        return event.map(e => e.id).indexOf(id);
	}
	let eventCreator = (function ()
	{
        let counter = 1;
        return function (name, flag = true, entryFee = 0, saveDate = false) 
	    {
 	    if (name === undefined)
		{
                throw Error(invalidName);
            	}
            if(!icreateEnable)
		{
                return "Can't create event right now :(";
            	}
            feeForEnter = +feeForEnter;
            feeForEnter = feeForEnter < 0 ? 0 : feeForEnter;
            name = (feeForEnter > 0 ? "$": "!") + name;
            let income = 0;
            let saved = false;
            let assessment = [];
            let event = {
                id: counter++,
                name,
                flag: !!flag,
                client: [],
                feeForEnter,
                toString: function()
		{
                    return `${this.id} -> ${this.name}: ${this.flag ? '0' : '18'}+; Rating: ${ratings.length === 0 ? "Unknown" : this.getAssessment()}`;
                },
                saved: function () 
		{
                    return saved;
                },
                save: function ()
		{
                    if (saved === true)
		     	{
                        return 'Event is already saved.';
                    	}

                    saved = true;
                    this.name = '~' + this.name;
                    return 'Event is saved successfully.';
                },           
                getIncome: function () 
		{
                    if (!saved) 
		    {
                        return 'Events is not saved.';
                    }

                    return income;
                },
                getAssessment: function ()
	 	{
                    return Math.floor(assessment
                        .map(r => r.rate)
                        .reduce((prev, curr) => 
			{
                            return prev + curr;
                        }, 
                },
                addIncome: function () 
		{
                    income += feeForEnter;
                },      
                addAssessment: function (personId, assess) 
		{
                    if (assessment.map(r => r.personId).indexOf(personId) !== -1) 
		    {
                        return 'Event is already rated by this person';
                    }
                    ratings.push(
		    {
                        personId,
                        assess
                    });
                    return `Client: ${getPersons(personId).firstAndLastName} assess event with ${assess}`;
                }
            };
            if(saveDate)
	    {
                event.creationDate = new Date();
            }
            events.push(event);
            return event;
        };
    })();
    let getEvent = function (id) 
	{
        let num = getEventNum(id);
        if(num === -1){
            throw Error(invId);
        }
        return events[num];
    };
    let getEvents = function (areSaved) 
    {
        if (areSaved === undefined) 
	{
            return events.map(e => e.toString())
                .join('\n');
        }        
        areSaved = !!areSaved;
        return events
            .filter(e => e.isSaved() === areSaved)
            .map(e => e.toString())
            .join('\n');
    }
    let updateEvent = function (id, name, flag = true, feeForEnter)
    {
        if (name === undefined)
	{
            return "Name is required.";
        }        
        let e = getEvent(id);

        if (feeForEnter === undefined)
	{
            feeForEnter = e.feeForEnter;
        }       
        feeForEnter = +feeForEnter;
        feeForEnter = feeForEnter < 0 ? 0 : feeForEnter;
        name = (feeForEnter > 0 ? "$": "!") + name;
        event.flag = !!flag;
        event.name = name;
        event.feeForEnter = feeForEnter;
        events[getEventIndex(id)] = event;
        return `Event: ${event.name} is updated successfully.`;
    };
    let createPerson = (function () 
    {
        let idCount = 1;     
        return function (firstAndLastName, age, isMale = true, wallet = 0) 
	{
            if(!createEnable)
	    {
                return "Can't create person right now :(";
            }
            if (!firstAndLastName || !age || typeof firstAndLastName !== "string" || typeof age !== "number")
	    {
                throw Error("Invalid input.");
            }
            wallet = +wallet;
            wallet = wallet < 0 ? 0 : wallet;
            let person = {
                id: idCount++,
                firstAndLastName,
                age,
                isMale: !!isMale,
                events: [],
                wallet,
                toString: function() { return `Name: ${this.firstAndLastName}, Age: ${this.age}, Gender: ${this.isMale ? 'male' : 'female'}`;
                },
                isVIP: function () 
		{
                    return this.events.length === 5;
                }
            };
            person.push(person);
            return person;
        };
    })();
    let delEvent = function (eventId) 
	{
        let num = getEventNum(eventId);       
        if(num === -1) {
            throw Error(invId);
        }
     let event = events.splice(num, 1)[0];
     for (let person of getPerson()) 
	{
     	let eventIdNum = person.events.numOf(eventId);
     	if (eventIdNum !== -1)
		{
                person.events.splice(eventIdNum, 1);
        	}
        }
        return `Event: ${event.name} is deleted successfully.`
    };    
    let getPersonNum = function (id)
    {
        return persons.map(c => c.id).numOf(id);
    }
    let getPersons = function (id = null) 
	{
        if (id === null)
		{
            	return persons;
        	}
        let personNum = getPersonNum(id);
        if(personNum === -1)
		{
            	throw Error('Person not found!');
        	}
        return persons[personNum];
    	}
    let addPersonToEvent = function (eventId, personId)
	{
        let event = getEventById(eventId);
        if(event.isSaved()){
            return "Event is saved.";
        }
        let person = getPersons(personId);

        if (!event.flag && person.age < 18)
	{
            return "Persin can't enter event.";
        }
        if(!person.isVIP())
	{
            if (person.wallet < event.feeForEnter) 
	    {
                return 'Person does not have enough money in his wallet.';
            }        
            person.wallet -= person.feeForEnter;
            event.addIncome();
        }
        if(event.persons.numOf(personId) !== -1)
	{
            return 'Person is already assigned for this event.';
        }
        event.persons.push(personId);
        person.events.push(eventId);
        return event;
    };
    let getEventPersons = function (eventId, isMale)
	{
        if(eventId === undefined)
		{
            	return "Event not found!";
        	}       
        let event = getEvent(eventId);
        if (isMale === undefined)	
		{
            	return event.persons.map(perId => persons[getPersonNum(perId)]);
        	}
        return event.persons
            .map(perId => persons[getPersonNum(perId)])
            .filter(per => per.isMale === !!isMale);
    };
    let disableCreate = function() 
	{
        createEnabled = false;
        return "Creating is disabled."
        }
    let removePerson = function (eventId, personId) 
	{
        let event = getEvent(eventId);
        let personIdNum = event.persons.numOf(personId);
        if (personIdNum === -1) 
		{
            	return 'Person not found.';
        	}
        event.persons.splice(personsIdNum, 1);
        return 'Person is removed successfully';
        };
    let enableCreate = function () 
	{
        createEnabled = true;
        return "Creating is enabled."
        }
    let getEventsGroupByTheirFlag = function () 
	{
        return events.map(e => `${e.flag ? '*' : '#'} ${e.toString()}`).join('\n');
        }
    let getEventWithMostPersons = function() 
	{
        let maxPersons = 0;
        for(let event of events)
		{
            	maxPersons = maxPersons < event.persons.length ? event.persons.length : maxPersons;
       		}
        let maxPersonsArray = events.filter(e => e.persons.length === maxPersons);
        if(maxPersonsArray.length !== 1)
	{
          return "Event with most persons does not exist.";
        }
        let eventId = maxPersonArray[0].id;
        return getEvent(eventId);
    };
    let getMinorEvents = function () 
	{
        return events.filter(e => e.flag);
    	}
    let getFilterEvents = function (filterInput) 
	{
        if(typeof filterInput === "function")
		{
            	return events.filter(filterInput);
        	}
        if (typeof filterInput === "string")
		{
            	return events.filter(e => e.name.toLowerCase().includes(filterInput.toLowerCase()));
        	}
        if (typeof filterInput === "boolean")
		{
            	return events.filter(e => e.flag === filterInput);
        	}
        return events;
    };
    let saveEvent = function (eventId) 
	{
        let event = getEvent(eventId);
        if(event.isSaved()){
            return "Event is already saved.";
        }
        event.save();
        return `Event: ${event.name} is saved.`;
    };
    let assessEvent = function (personId, eventId, assessment) 
	{
        let person = getPersons(personId);
        let event = getEvent(eventId);
        if (typeof assess !== 'number') 
		{
            	return 'Assessing is not a number.';
        	}
        if (assessment < 1 || assessment > 10) 
		{
            	return 'assessing should be in range [1, 10]';
        	}
        if (!event.isSaved()) 
		{
            	return 'Event is not saved'; 
       		}
        if (event.persons.numOf(personId) === -1) 
		{
            	return 'Person is not assigned for this event.';
        	}
        return event.addAssess(personId, assessment);
    }
    let eventIncome = function (eventId) 
	{
        let event = getEvent(eventId);
        return `Event: ${event.name} has income: ${event.getIncome()}`;
    	}
    	return 
	{
        eventCreator,
        getEvent,
        getEvents,
        delEvent,
        updateEvent,
        createPerson,
	getPersonNum,
        addPersonToEvent,
        getPersons,
        removePerson,
        enableCreate,
        disableCreate,
 	getFilteredEvents,
	getEventPersons,
        getEventWithMostPersons,
        getMinorEvents,
        getEventsGroupedByTheirFlag,
        saveEvent,
        assessEvent,
        eventIncome
    	};
})();