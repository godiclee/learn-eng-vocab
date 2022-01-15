import requests
from bs4 import BeautifulSoup

headers = requests.utils.default_headers()

headers.update(
    {
        'User-Agent': 'My User Agent 1.0',
    }
)

result = []
level = 1

with open("level" + str(level) + ".txt", 'r') as f:
    for i, line in enumerate(f.readlines()):
        word = line.strip()

        response = requests.get(
            "https://dictionary.cambridge.org/zht/%E8%A9%9E%E5%85%B8/%E8%8B%B1%E8%AA%9E-%E6%BC%A2%E8%AA%9E-%E7%B9%81%E9%AB%94/" + word, headers=headers)
        print(i, word)
        
        soup = BeautifulSoup(response.text, "html.parser")
        
        try:
            pos = soup.find_all("span", {"class": "dpos"})[0].text
        except:
            print(word, "頁面不存在")
            continue
        if pos == 'phrasal verb':
            print(word, "pharsal verb")
            continue

        upper_level = soup.find_all("div", {"class": "pos-body"})[0]
        
        for meaning in upper_level.find_all("div", {"class": "dsense"}):
            eng_meaning = meaning.find_all("div", {"class": "ddef_d"})[0].text
            chi_meaning = meaning.find_all("div", {"class": "ddef_b"})[0].find_all("span")[0].text
            count = 0
            for sentence in meaning.find_all("div", {"class": "ddef_b"})[0].find_all("div", {"class": "examp"}):
                eng_sentence_raw = sentence.find("span", {"class": ["eg", "deg"]})
                eng_sentence = eng_sentence_raw.text
                try:
                    chi_sentence = sentence.find("span", {"class": ["trans", "dtrans", "dtrans-se", "hdb", "break-cj"]}).text
                except:
                    print('只有英文沒有中文句子')
                    continue
                if len(eng_sentence.split()) <= 2: # discard short sentence
                    continue
                
                eng_sentence_list = eng_sentence.split()
                eng_sentence_list_1 = []
                for i in eng_sentence_list:
                    if i[-1] in [',', '.', '!', '?', ':', ';']:
                        eng_sentence_list_1 += [i[:-1], i[-1]]
                    else:
                        eng_sentence_list_1 += [i]
                
                for index, i in enumerate(eng_sentence_list_1):
                    word = word.lower()
                    i = i.lower()
                    if word == i or word + 's' == i or word + 'd' == i \
                        or word + 'ed' == i or word + 'ing' == i or word[:-1] + 'ies' == i or word + word[-1] + 'ed' == i \
                        or word + word[-1] + 'ing' == i or word[:-1] + 'ing' == i or word + 'es' == i or word[:-1] + 'ied' == i:
                        break
                else:
                    continue
                count += 1
                if count > 1:
                    break

                new_card = {"word": word, "chi": chi_meaning, "eng": eng_meaning, "pos": pos, 
                        "chisen": chi_sentence, "engsen": ' '.join(eng_sentence_list_1), "level": level, "hole" : index}
                holes = [index]

                bold = eng_sentence_raw.find_all('span',{'class':'b db'})

                if bold:
                    bold = [b.text for b in bold]
                    bold = ' '.join(bold).split(' ')
                    for b in bold:
                        for index, i in enumerate(eng_sentence_list_1):
                            if b == i and not '/' in b:
                                holes.append(index)
                                break
                        else:
                            continue
                            #print(b, eng_sentence_list_1)
                new_card["holes"] = sorted(holes)

                #print(new_card)
                result.append(new_card)


print(len(result))
import json
with open("level" + str(level) + '.json', 'w') as f:
    json.dump(result, f)

