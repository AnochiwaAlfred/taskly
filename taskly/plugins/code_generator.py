
import random
import string
from datetime import date
import math
import random




def generateUniqueId():
    random_numbers = ''.join(str(random.randint(0, 9)) for _ in range(6))
    random_alphabets = ''.join(random.choice(string.ascii_uppercase) for _ in range(3))
    year = str(date.today().year)[2:]
    unique_id = f"{random_numbers}{random_alphabets}{year}"
    return unique_id

