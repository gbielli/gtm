"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { useState } from "react";

// Composant pour le formulaire de création d'événement
const CreateEventDialog = ({ onCreateEvent }) => {
  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    parameters: {},
  });
  const [newParamName, setNewParamName] = useState("");
  const [newParamValue, setNewParamValue] = useState("");

  const handleAddParameter = () => {
    if (newParamName && newParamValue) {
      setEventData({
        ...eventData,
        parameters: {
          ...eventData.parameters,
          [newParamName]: newParamValue,
        },
      });
      setNewParamName("");
      setNewParamValue("");
    }
  };

  const handleCreateEvent = () => {
    onCreateEvent({
      ...eventData,
      id: Date.now(),
    });
    setEventData({ name: "", description: "", parameters: {} });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Nouvel événement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouvel événement</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nom de lévénement</label>
            <Input
              value={eventData.name}
              onChange={(e) =>
                setEventData({ ...eventData, name: e.target.value })
              }
              placeholder="ex: click_content"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={eventData.description}
              onChange={(e) =>
                setEventData({ ...eventData, description: e.target.value })
              }
              placeholder="Description courte de l'événement"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Paramètres initiaux</label>
            {Object.entries(eventData.parameters).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <span className="text-sm">
                  {key}: {value}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    const newParams = { ...eventData.parameters };
                    delete newParams[key];
                    setEventData({ ...eventData, parameters: newParams });
                  }}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}

            <div className="flex gap-2">
              <Input
                placeholder="Nom du paramètre"
                value={newParamName}
                onChange={(e) => setNewParamName(e.target.value)}
              />
              <Input
                placeholder="Valeur"
                value={newParamValue}
                onChange={(e) => setNewParamValue(e.target.value)}
              />
              <Button onClick={handleAddParameter} size="sm">
                <Plus size={16} />
              </Button>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleCreateEvent}
            disabled={!eventData.name}
          >
            Créer l'événement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Composant pour la carte d'événement
const EventCard = ({ event, onAddParameter, onDeleteParameter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newParamName, setNewParamName] = useState("");
  const [newParamValue, setNewParamValue] = useState("");

  const handleAddParameter = () => {
    if (newParamName && newParamValue) {
      onAddParameter(event.id, newParamName, newParamValue);
      setNewParamName("");
      setNewParamValue("");
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">{event.name}</h3>
          {event.description && (
            <p className="text-sm text-gray-500 mt-1">{event.description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </div>

      <div className="w-full h-1 bg-blue-500 my-2 rounded" />

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            {Object.entries(event.parameters).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <span className="text-sm text-gray-600">{key}:</span>
                <span className="text-sm">{value}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => onDeleteParameter(event.id, key)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Nom du paramètre"
              value={newParamName}
              onChange={(e) => setNewParamName(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Valeur"
              value={newParamValue}
              onChange={(e) => setNewParamValue(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddParameter} size="sm">
              <Plus size={16} />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

// Composant principal
const TrackingEventsBoard = () => {
  const [events, setEvents] = useState([]);

  const handleCreateEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleAddParameter = (eventId, paramName, paramValue) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            parameters: {
              ...event.parameters,
              [paramName]: paramValue,
            },
          };
        }
        return event;
      })
    );
  };

  const handleDeleteParameter = (eventId, paramName) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          const newParameters = { ...event.parameters };
          delete newParameters[paramName];
          return {
            ...event,
            parameters: newParameters,
          };
        }
        return event;
      })
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Événements</h1>
        <CreateEventDialog onCreateEvent={handleCreateEvent} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onAddParameter={handleAddParameter}
            onDeleteParameter={handleDeleteParameter}
          />
        ))}
      </div>
    </div>
  );
};

export default TrackingEventsBoard;
