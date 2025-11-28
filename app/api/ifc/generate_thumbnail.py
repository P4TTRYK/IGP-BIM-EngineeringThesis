import io
import multiprocessing
import os

import ifcopenshell.geom
import trimesh
from PIL import Image

# https://github.com/mikedh/trimesh/issues/1312
os.environ['PYGLET_HEADLESS'] = '1'


# https://docs.ifcopenshell.org/ifcopenshell-python/geometry_processing.html
def convert_to_gltf(ifc, glb):
    ifc_file = ifcopenshell.open(ifc)

    settings = ifcopenshell.geom.settings()
    settings.set("dimensionality", ifcopenshell.ifcopenshell_wrapper.CURVES_SURFACES_AND_SOLIDS)
    settings.set("apply-default-materials", True)

    serializer_settings = ifcopenshell.geom.serializer_settings()
    serializer_settings.set("use-element-guids", True)

    serializer = ifcopenshell.geom.serializers.gltf(glb, settings, serializer_settings)

    serializer.setFile(ifc_file)
    serializer.setUnitNameAndMagnitude("METER", 1.0)
    serializer.writeHeader()

    iterator = ifcopenshell.geom.iterator(settings, ifc_file, multiprocessing.cpu_count())
    if iterator.initialize():
        while True:
            serializer.write(iterator.get())
            if not iterator.next():
                break
    serializer.finalize()


# https://stackoverflow.com/questions/74248100/saving-cross-section-of-3d-object-by-trimesh-python
def render_glb_thumbnail(glb_path, output_path, size=(512, 384)):
    scene = trimesh.load_scene(glb_path)
    # https://trimesh.org/trimesh.scene.scene.html#trimesh.scene.scene.Scene.set_camera
    scene.set_camera(angles=(-0.1, -0.5, 0))
    # 197, 192, 200 | 46, 29, 55
    bytes_ = scene.save_image(resolution=size, background=[255, 255, 255, 255])

    image = Image.open(io.BytesIO(bytes_))
    image.save(output_path)


def generate_thumbnail(ifc, png):
    glb = "temp.glb"

    convert_to_gltf(ifc, glb)

    if os.path.exists(glb):
        render_glb_thumbnail(glb, png)

        os.remove(glb)
    else:
        print(f"Error: {glb} not found.")
