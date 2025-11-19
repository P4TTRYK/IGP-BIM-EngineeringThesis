import subprocess


def convert_ifc2xkt(ifc_file, xkt_file):
    # use bash command to convert ifc to xkt
    command = ["xeokit-convert", "-s", ifc_file, "-o", xkt_file]
    try:
        subprocess.run(command, check=True)
        return True
    except subprocess.CalledProcessError as e:
        print("Error during conversion:", e)
        return False
