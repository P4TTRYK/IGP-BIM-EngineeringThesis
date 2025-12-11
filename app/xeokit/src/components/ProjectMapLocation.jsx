import {MapContainer, Marker, TileLayer} from 'react-leaflet'

export const ProjectMapLocation = ({location}) => {
    return (
        <MapContainer center={location} zoom={13} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={location}/>
        </MapContainer>
    )
}
