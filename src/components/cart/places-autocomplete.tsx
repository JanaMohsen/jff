import {usePlacesWidget} from "react-google-autocomplete";
import {Input} from "@/components/ui/input";
import PlaceResult = google.maps.places.PlaceResult;

interface Props {
    id: string
    name: string
    setPlace: (value: (((prevState: (PlaceResult | null)) => (PlaceResult | null)) | PlaceResult | null)) => void
}

const PlacesAutocomplete = ({id, name, setPlace}: Props) => {
    const {ref} = usePlacesWidget<HTMLInputElement>({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
        options: {
            types: ["geocode", "establishment"],
            componentRestrictions: {country: ["lb"]},
        },
        onPlaceSelected: (place) => {
            setPlace(place)
        },
    });

    return <Input id={id} name={name} ref={ref} placeholder="Enter address..."/>
}

export default PlacesAutocomplete