export function SavedQueries(params) {
  
  function onSavedQueryClick(savedQuery){
    params.onQuerySelect(savedQuery);
  }

  function handleReset() {
    const confirmed = window.confirm("Are you sure you want to erase the list?");
    if (confirmed && params.onReset) {
      params.onReset();
    }
  }

  function getQueries() {
    return params.savedQueries.map((item, idx) => {
      let trimTitle = item.queryName.substring(0, 30);
      return (<li 
        key={idx} 
        onClick={()=>onSavedQueryClick(item)} 
        className={(item.queryName === params.selectedQueryName)?"selected":""}
      >{trimTitle + ": \"" + item.q + "\""} </li>);
    })
  } 

  return (
      <div>
        <br/>
        {params.currentUser && (
          <>
            <button onClick={handleReset}>Reset</button>
            <br/>
          </>
        )}
        <ul >{
          (params.savedQueries && params.savedQueries.length > 0)
          ? getQueries()
          : <li>No Saved Queries, Yet!</li>
        }</ul>
      </div>
    )
  
  }