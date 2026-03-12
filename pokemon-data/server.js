require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const TABLE_NAME = process.env.TABLE_NAME || 'pokemon_stats';

// 메인 페이지 (표 형식으로 데이터 출력)
app.get('/', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*&order=id.asc`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) throw new Error(`Supabase error: ${response.status}`);
    const data = await response.json();

    // HTML 구성
    let html = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <title>포켓몬 도감 (1세대)</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f9; margin: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #ef5350; color: white; text-transform: uppercase; font-size: 0.9em; }
            tr:hover { background-color: #f1f1f1; }
            .type-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; color: white; margin-right: 5px; font-weight: bold; }
            .grass { background-color: #78C850; } .poison { background-color: #A040A0; } .fire { background-color: #F08030; }
            .water { background-color: #6890F0; } .bug { background-color: #A8B820; } .normal { background-color: #A8A878; }
            .electric { background-color: #F8D030; } .ground { background-color: #E0C068; } .fairy { background-color: #EE99AC; }
            .fighting { background-color: #C03028; } .psychic { background-color: #F85888; } .rock { background-color: #B8A038; }
            .steel { background-color: #B8B8D0; } .ice { background-color: #98D8D8; } .ghost { background-color: #705898; }
            .dragon { background-color: #7038F8; } .flying { background-color: #A890F0; }
            .stat-num { font-weight: bold; color: #555; }
        </style>
    </head>
    <body>
        <h1>PokeAPI x Supabase 1세대 도감</h1>
        <table>
            <thead>
                <tr>
                    <th>번호</th>
                    <th>이름</th>
                    <th>타입</th>
                    <th>HP</th>
                    <th>공격</th>
                    <th>방어</th>
                    <th>특수공격</th>
                    <th>특수방어</th>
                    <th>스피드</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(p => {
      const typeBadges = p.type.map(t => `<span class="type-badge ${t}">${t}</span>`).join('');
      html += `
        <tr>
            <td>${p.id}</td>
            <td><strong>${p.name.toUpperCase()}</strong></td>
            <td>${typeBadges}</td>
            <td class="stat-num">${p.hp}</td>
            <td class="stat-num">${p.atk}</td>
            <td class="stat-num">${p.def}</td>
            <td class="stat-num">${p.spatk}</td>
            <td class="stat-num">${p.spdef}</td>
            <td class="stat-num">${p.speed}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
        </table>
    </body>
    </html>
    `;

    res.send(html);
  } catch (error) {
    res.status(500).send(`<h1>에러 발생</h1><p>${error.message}</p>`);
  }
});

// 기존 JSON API는 유지
app.get('/api/pokemon', async (req, res) => {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 이름으로 포켓몬 검색 API
app.get('/api/pokemon/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?name=eq.${name}&select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`);
    }

    const data = await response.json();
    if (data.length === 0) {
      return res.status(404).json({ message: '해당 포켓몬을 찾을 수 없어.' });
    }
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 성공적으로 시작되었어! http://localhost:${PORT} 에서 확인해봐.`);
});