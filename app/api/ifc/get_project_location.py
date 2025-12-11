import json

import requests


def get_project_location(model):
    location = (0, 0)

    # from docs:
    # b := c[1] + c[2]/60. + c[3]/3600. + c[4]/3600.e6; -- -50.975864
    def dms_to_decimal(dms):
        degrees, minutes, seconds, millionths = dms
        decimal = abs(degrees) + minutes / 60.0 + seconds / 3600.0 + millionths / 3600.0e6
        if degrees < 0:
            decimal = -decimal
        return decimal

    # site location is provided
    # Level20
    # https://ifc43-docs.standards.buildingsmart.org/IFC/RELEASE/IFC4x3/HTML/lexical/IfcCompoundPlaneAngleMeasure.htm
    site_location = model.by_type('IfcSite')[0].get_info()
    lat_dms = site_location.get('RefLatitude', None)
    lon_dms = site_location.get('RefLongitude', None)

    if lat_dms and lon_dms:
        lat = round(dms_to_decimal(lat_dms), 6)
        lon = round(dms_to_decimal(lon_dms), 6)

        location = (lon, lat)
    else:
        # Level10
        # geocode address from text address
        # https://standards.buildingsmart.org/IFC/RELEASE/IFC4_1/FINAL/HTML/schema/ifcactorresource/lexical/ifcpostaladdress.htm
        postal_address = model.by_type('IfcPostalAddress')

        if len(postal_address) > 0:
            address_info = postal_address[0].get_info()

            # create nominatim query string
            query_parts = []
            if address_info.get('AddressLines'):
                query_parts.extend(address_info['AddressLines'])
            if address_info.get('Town'):
                query_parts.append(address_info['Town'])
            if address_info.get('Region'):
                query_parts.append(address_info['Region'])
            if address_info.get('PostalCode'):
                query_parts.append(address_info['PostalCode'])
            if address_info.get('Country'):
                query_parts.append(address_info['Country'])

            query_string = ', '.join(query_parts)

            if len(query_string) > 0:
                # https://nominatim.openstreetmap.org/ui/search.html
                # https://docs.python-requests.org/en/latest/user/quickstart/#passing-parameters-in-urls
                url = "https://nominatim.openstreetmap.org/search"
                params = {
                    'q': query_string,
                    'format': 'jsonv2',
                    'limit': 1
                }

                try:
                    # Good practice to set a custom User-Agent
                    response = requests.get(url, params=params, headers={'User-Agent': 'BScopeApp/1.0'})
                    response.raise_for_status()
                    data = response.json()

                    if len(data) > 0:
                        lat = round(float(data[0]['lat']), 6)
                        lon = round(float(data[0]['lon']), 6)
                        location = (lon, lat)
                except requests.RequestException as e:
                    print(f"Geocoding request failed: {e}")

    return json.dumps(location)
