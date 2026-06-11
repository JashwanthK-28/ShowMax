import urllib.request
import re
import json

movies = ["RRR", "Baahubali 2", "K.G.F Chapter 2", "Jawan", "Dangal", "Pathaan", "Pushpa The Rise"]
actors = ["Shah Rukh Khan", "Ram Charan", "Prabhas", "Yash", "Aamir Khan", "Allu Arjun", "N. T. Rama Rao Jr.", "Deepika Padukone", "Alia Bhatt", "Priyanka Chopra", "Samantha Ruth Prabhu", "Anushka Shetty", "Rashmika Mandanna", "Katrina Kaif", "Kareena Kapoor Khan", "Salman Khan", "Hrithik Roshan"]

def search_imdb(query):
    try:
        url = "https://v3.sg.media-imdb.com/suggestion/x/" + urllib.parse.quote(query) + ".json"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read())
        if data.get("d") and len(data["d"]) > 0:
            return data["d"][0].get("i", {}).get("imageUrl", "")
    except Exception as e:
        print(f"Error {query}: {e}")
    return ""

print("Movies:")
for m in movies:
    print(f"{m}: {search_imdb(m)}")

print("\nActors:")
for a in actors:
    print(f"{a}: {search_imdb(a)}")
