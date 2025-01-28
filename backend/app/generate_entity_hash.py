import hashlib
import random
import string

def generate_hash(name: str) -> str:
    initials = ''.join([word[0].upper() for word in name.split()])
    random_part = ''.join(random.choices(string.ascii_letters + string.digits, k=4))

    name_hash = hashlib.sha256(name.encode()).hexdigest()[:8]
    entity_hash = f"{initials}{random_part}{name_hash}"
    return entity_hash

if __name__ == "__main__":
    name = "Jason Mraz Kaleeshi"
    entity_id = generate_hash(name)
    print(f"Entity Hash for '{name}': {entity_id}")
