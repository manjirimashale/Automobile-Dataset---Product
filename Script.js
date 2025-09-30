// Sample dataset (50 rows)
const data = [
{Make:'Hyundai',Fuel:'Petrol',HP:210,Mileage:13.40,Cyl:3},
{Make:'Honda',Fuel:'Petrol',HP:372,Mileage:16.94,Cyl:3},
{Make:'Toyota',Fuel:'Petrol',HP:189,Mileage:18.11,Cyl:4},
{Make:'Toyota',Fuel:'Diesel',HP:182,Mileage:14.98,Cyl:8},
{Make:'Ford',Fuel:'Petrol',HP:286,Mileage:14.81,Cyl:4},
{Make:'BMW',Fuel:'Diesel',HP:198,Mileage:17.22,Cyl:6},
{Make:'Tesla',Fuel:'Electric',HP:220,Mileage:99.12,Cyl:0},
{Make:'Chevrolet',Fuel:'CNG',HP:150,Mileage:16.54,Cyl:4},
{Make:'Honda',Fuel:'Diesel',HP:160,Mileage:15.31,Cyl:4},
{Make:'Ford',Fuel:'CNG',HP:140,Mileage:15.98,Cyl:3},
{Make:'Toyota',Fuel:'Petrol',HP:174,Mileage:17.80,Cyl:4},
{Make:'Hyundai',Fuel:'Electric',HP:180,Mileage:101.45,Cyl:0},
{Make:'BMW',Fuel:'Petrol',HP:300,Mileage:12.11,Cyl:8},
{Make:'Chevrolet',Fuel:'Diesel',HP:170,Mileage:16.44,Cyl:6},
{Make:'Honda',Fuel:'CNG',HP:130,Mileage:17.67,Cyl:3},
{Make:'Ford',Fuel:'Petrol',HP:220,Mileage:15.20,Cyl:6},
{Make:'Toyota',Fuel:'Diesel',HP:210,Mileage:16.02,Cyl:6},
{Make:'Tesla',Fuel:'Electric',HP:250,Mileage:96.78,Cyl:0},
{Make:'Hyundai',Fuel:'Petrol',HP:145,Mileage:20.11,Cyl:4},
{Make:'Chevrolet',Fuel:'CNG',HP:120,Mileage:14.95,Cyl:4},
{Make:'Ford',Fuel:'Diesel',HP:190,Mileage:15.67,Cyl:8},
{Make:'BMW',Fuel:'Electric',HP:210,Mileage:95.33,Cyl:0},
{Make:'Honda',Fuel:'Petrol',HP:160,Mileage:18.44,Cyl:4},
{Make:'Toyota',Fuel:'CNG',HP:135,Mileage:16.33,Cyl:3},
{Make:'Hyundai',Fuel:'Diesel',HP:175,Mileage:16.88,Cyl:4},
{Make:'Chevrolet',Fuel:'Petrol',HP:200,Mileage:14.22,Cyl:6},
{Make:'Ford',Fuel:'Petrol',HP:240,Mileage:13.90,Cyl:8},
{Make:'Honda',Fuel:'Electric',HP:200,Mileage:102.21,Cyl:0},
{Make:'Toyota',Fuel:'Petrol',HP:155,Mileage:19.02,Cyl:4},
{Make:'BMW',Fuel:'Diesel',HP:230,Mileage:14.95,Cyl:8},
{Make:'Chevrolet',Fuel:'CNG',HP:132,Mileage:16.88,Cyl:4},
{Make:'Hyundai',Fuel:'Petrol',HP:180,Mileage:17.55,Cyl:4},
{Make:'Ford',Fuel:'CNG',HP:115,Mileage:15.12,Cyl:3},
{Make:'Tesla',Fuel:'Electric',HP:300,Mileage:97.45,Cyl:0},
{Make:'Honda',Fuel:'Diesel',HP:165,Mileage:16.20,Cyl:4},
{Make:'Toyota',Fuel:'Petrol',HP:175,Mileage:18.10,Cyl:6},
{Make:'BMW',Fuel:'Petrol',HP:320,Mileage:11.50,Cyl:8},
{Make:'Chevrolet',Fuel:'Diesel',HP:160,Mileage:16.01,Cyl:6},
{Make:'Hyundai',Fuel:'CNG',HP:128,Mileage:17.05,Cyl:3},
{Make:'Ford',Fuel:'Petrol',HP:210,Mileage:16.30,Cyl:4},
{Make:'Toyota',Fuel:'Diesel',HP:200,Mileage:15.88,Cyl:6},
{Make:'Honda',Fuel:'Petrol',HP:140,Mileage:19.50,Cyl:4},
{Make:'Chevrolet',Fuel:'Electric',HP:190,Mileage:99.80,Cyl:0}
];

// Utilities
const unique = arr => [...new Set(arr)];
// populate data table
const dataTbody = document.querySelectorAll('#dataTable tbody')[0];
data.forEach(r=>{
  const tr=document.createElement('tr');
  tr.innerHTML=`<td>${r.Make}</td><td>${r.Fuel}</td><td>${r.HP}</td><td>${r.Mileage}</td><td>${r.Cyl}</td>`;
  dataTbody.appendChild(tr);
});

// Slicer UI
const cyls = unique(data.map(d=>d.Cyl)).sort((a,b)=>a-b);
const slicer = document.getElementById('slicerButtons');
const allBtn = document.createElement('button'); allBtn.className='sbtn active'; allBtn.textContent='All'; allBtn.dataset.cyl='all'; slicer.appendChild(allBtn);
cyls.forEach(c=>{const b=document.createElement('button'); b.className='sbtn'; b.textContent=c; b.dataset.cyl=c; slicer.appendChild(b);});

let activeFilter='all';
slicer.addEventListener('click', e=>{
  if(e.target.tagName!=='BUTTON') return;
  Array.from(slicer.querySelectorAll('button')).forEach(x=>x.classList.remove('active'));
  e.target.classList.add('active');
  activeFilter = e.target.dataset.cyl;
  renderAll();
});

// Chart contexts
const ctxAvg = document.getElementById('avgMileageChart').getContext('2d');
const ctxCyl = document.getElementById('mileageByCyl').getContext('2d');
const ctxHP = document.getElementById('hpScatter').getContext('2d');
const ctxCnt = document.getElementById('countFuel').getContext('2d');
let chartAvg, chartCyl, chartHP, chartCnt;

// compute pivot
function computePivot(filter){
  const rows = filter === 'all' ? data : data.filter(d=>String(d.Cyl) === String(filter));
  const byFuel = {};
  rows.forEach(r=>{ if(!byFuel[r.Fuel]) byFuel[r.Fuel]=[]; byFuel[r.Fuel].push(r.Mileage); });
  const result = Object.keys(byFuel).map(k=>({fuel:k, avg: byFuel[k].reduce((a,b)=>a+b,0)/byFuel[k].length}));
  result.sort((a,b)=>b.avg-a.avg);
  return result;
}

function renderAll(){
  const pivot = computePivot(activeFilter);
  // update pivot table
  const pt = document.querySelector('#pivotTable tbody'); pt.innerHTML='';
  pivot.forEach(r=>{ const tr=document.createElement('tr'); tr.innerHTML=`<td>${r.fuel}</td><td>${r.avg.toFixed(2)}</td>`; pt.appendChild(tr); });

  // avg mileage by fuel - bar
  const labels = pivot.map(p=>p.fuel);
  const values = pivot.map(p=>Number(p.avg.toFixed(2)));
  if(chartAvg) chartAvg.destroy();
  chartAvg = new Chart(ctxAvg, {type:'bar', data:{labels, datasets:[{label:'Avg Mileage', data:values, backgroundColor: 'rgba(12,123,123,0.7)'}]}, options:{plugins:{legend:{display:false}}, responsive:true}});

  // mileage by cylinders (average per cyl group)
  const cylGroups = unique(data.map(d=>d.Cyl)).sort((a,b)=>a-b);
  const cylAvgs = cylGroups.map(c=>{
    const rows = data.filter(d=>d.Cyl===c && (activeFilter==='all' || String(d.Cyl)===String(activeFilter)));
    if(rows.length===0) return null;
    return rows.reduce((a,b)=>a+b.Mileage,0)/rows.length;
  });
  const cylLabels = cylGroups.map(String);
  const cylValues = cylAvgs.map(v=>v===null?0:Number((v||0).toFixed(2)));
  if(chartCyl) chartCyl.destroy();
  chartCyl = new Chart(ctxCyl, {type:'bar', data:{labels:cylLabels, datasets:[{label:'Avg Mileage by Cyl', data:cylValues, backgroundColor:'rgba(124,58,237,0.7)'}]}, options:{plugins:{legend:{display:false}}, responsive:true}});

  // HP vs Mileage scatter (filtered)
  const scatterData = (activeFilter==='all' ? data : data.filter(d=>String(d.Cyl)===String(activeFilter))).map(d=>({x:d.HP,y:d.Mileage}));
  if(chartHP) chartHP.destroy();
  chartHP = new Chart(ctxHP, {type:'scatter', data:{datasets:[{label:'HP vs Mileage', data:scatterData, backgroundColor:'rgba(14,165,164,0.7)'}]}, options:{scales:{x:{title:{display:true,text:'Horsepower'}}, y:{title:{display:true,text:'Mileage'}}}, responsive:true}});

  // Count by fuel
  const fuels = unique(data.map(d=>d.Fuel));
  const counts = fuels.map(f=> (activeFilter==='all' ? data : data.filter(d=>String(d.Cyl)===String(activeFilter))).filter(d=>d.Fuel===f).length );
  if(chartCnt) chartCnt.destroy();
  chartCnt = new Chart(ctxCnt, {type:'bar', data:{labels:fuels, datasets:[{label:'Count', data:counts, backgroundColor:'rgba(16,185,129,0.7)'}]}, options:{plugins:{legend:{display:false}}, responsive:true}});

  // Key statistics
  const keyStats = document.getElementById('keyStats');
  const allValues = pivot.map(p=>p.avg);
  const meanOfAvgs = allValues.length ? (allValues.reduce((a,b)=>a+b,0)/allValues.length).toFixed(2) : '-';
  keyStats.innerHTML = `<li>Top fuel type: ${pivot[0] ? pivot[0].fuel + ' (' + pivot[0].avg.toFixed(2) + ')' : '-'}</li><li>Bottom fuel type: ${pivot[pivot.length-1] ? pivot[pivot.length-1].fuel + ' (' + pivot[pivot.length-1].avg.toFixed(2) + ')' : '-'}</li><li>Mean of fuel-type averages: ${meanOfAvgs}</li>`;

  // Conclusions
  const cons = document.getElementById('conclusionsList');
  const top = pivot[0] ? `${pivot[0].fuel} tends to have the highest average mileage (${pivot[0].avg.toFixed(2)})` : 'No data';
  const bottom = pivot[pivot.length-1] ? `${pivot[pivot.length-1].fuel} tends to have the lowest average mileage (${pivot[pivot.length-1].avg.toFixed(2)})` : 'No data';
  const trend = 'Across the dataset, higher cylinder counts generally correspond to lower mileage.';
  cons.innerHTML = `<li>${top}</li><li>${bottom}</li><li>${trend}</li>`;
}

// initial render
renderAll();

// populate second data table (if any)
const dataTableBody = document.querySelectorAll('#dataTable tbody')[0];
// (already populated earlier)

// CSV download
// NOTE: This assumes an element with id 'downloadCsv' exists in the HTML, 
// which was removed in your modified HTML but kept here for function completeness.
/*
document.getElementById('downloadCsv').addEventListener('click', ()=>{
  const hdr = ['Make','Fuel Type','Horsepower','Mileage','Number of Cylinders'];
  const rows = data.map(r=>[r.Make,r.Fuel,r.HP,r.Mileage,r.Cyl]);
  const csv = [hdr.join(','), ...rows.map(r=>r.join(','))].join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='car_specs_full_sample.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});
*/