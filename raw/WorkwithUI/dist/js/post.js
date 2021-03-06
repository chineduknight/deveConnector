// const id = localStorage.getItem('clickedPost');
const queryStr = document.location.search.replace(/^.*?\?/, '');
const usp = new URLSearchParams(queryStr);

const id = usp.get('clickedPost');

const commentBody = document.getElementById('currentComment');
const successDiv = document.getElementById('success');
const userId = localStorage.getItem('userId');

callFetchAPI('/posts/' + id, 'GET', null, ({ statusCode, data }) => {
  if (statusCode === 400) {
    alert('there was an error');
    console.log(data);
  } else if (statusCode === 200) {
    const sectionBody = document.getElementById('currentPost');
    console.log(data);

    const firstPart = document.createElement('div');
    const secondPart = document.createElement('div');
    firstPart.innerHTML = `
      <a href="profile.html">
      <img
      class="round-img"
      src="https://${data.avatar}"
      alt=""
      />
      <h4>${data.name}</h4>
      </a>`;
    secondPart.innerHTML = `
    <p class="my-1">${data.text}</p> <p class="my-1">Posted on ${formatDate(
      data.date
    )}</p> `;

    sectionBody.appendChild(firstPart);
    sectionBody.appendChild(secondPart);

    data.comments.forEach(currentcomment => {
      // create the delete Button
      console.log(userId === currentcomment.user);
      let deleteButtonHTML = '';

      if (userId === currentcomment.user) {
        deleteButtonHTML = `
        <button onClick="deleteComment(event,'${
          currentcomment._id
        }')" type='button' class='btn btn-danger'>
        <i class='fas fa-times'></i>
        </button>
      
      `;
      }

      const comment = document.createElement('div');
      comment.classList = 'post bg-white p-1 my-1';

      comment.innerHTML = `
    
    <div>
      <a href="profile.html">
        <img
          class="round-img"
          src="https:${currentcomment.avatar}"
          alt=""
        />
        <h4>${currentcomment.name}</h4>
      </a>
    </div>
    <div>
      <p class="my-1">
      ${currentcomment.text}
      </p>
      <p class="my-1">Posted on
      ${formatDate(currentcomment.date)}
      </p>
      ${deleteButtonHTML}
    
    `;

      commentBody.appendChild(comment);
    });
  }
});

function addComment(event) {
  event.preventDefault();
  const text = document.getElementById('commentContent').value;

  callFetchAPI(
    '/posts/comments/' + id,
    'POST',
    { text },
    ({ data, statusCode }) => {
      if (statusCode === 400) {
        console.log(data);
      } else if (statusCode === 200) {
        console.log(data);

        const comment = document.createElement('div');
        comment.classList = 'post bg-white p-1 my-1';
        comment.innerHTML = `
        
        <div>
          <a href="profile.html">
            <img
              class="round-img"
              src="https:${data[0].avatar}"
              alt=""
            />
            <h4>${data[0].name}</h4>
          </a>
        </div>
        <div>
          <p class="my-1"> ${data[0].text}</p>
          <p class="my-1">Posted on ${formatDate(data[0].date)}</p>
          <button onClick="deleteComment(event,'${
            data[0]._id
          }')" type='button' class='btn btn-danger'>
          <i class='fas fa-times'></i>
          </button>
        </div>
     
        
        `;

        commentBody.prepend(comment);
        document.getElementById('commentContent').value = '';

        const alertDiv = document.getElementById('displayAlert');
        displayAlert(alertDiv, 'Comment Added');
      }
    }
  );
}

function deleteComment(event, commentId) {
  //Just call the fetch API
  callFetchAPI(
    `/posts/comments/${id}/${commentId}`,
    'DELETE',
    null,
    ({ statusCode, data }) => {
      if (statusCode === 400) {
        console.log(data);
      } else if (statusCode === 200) {
        console.log(data);
        event.target.parentElement.parentElement.remove();

        const alertDiv = document.getElementById('displayAlert');
        displayAlert(alertDiv, 'Comment Removed');
      }
    },
    err => {
      const errMsg = document.createElement('h3');
      errMsg.classList.add('p-1');
      errMsg.textContent = err;

      successDiv.appendChild(errMsg);
      successDiv.classList.remove('hide');

      setdisplayAlert(() => {
        successDiv.removeChild(errMsg);
        successDiv.classList.add('hide');
      }, 3000);
      console.log(err);
    }
  );
}
