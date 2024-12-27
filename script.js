// script.js

let tree = {
  id: 1,
  title: "시작",
  text: "",
  children: []
};

let nodeId = 2;

// 트리 렌더링 함수
function renderTree(node, container, parentNode = null) {
  container.innerHTML = ""; // 기존 내용 초기화

  // 현재 노드 생성
  const nodeElement = document.createElement("div");
  nodeElement.className = "node";

  // 노드 제목 입력 필드
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = node.title;
  titleInput.placeholder = "제목을 입력하세요";
  titleInput.addEventListener("input", (e) => {
    node.title = e.target.value;
  });

  // 대사 입력 필드
  const textarea = document.createElement("textarea");
  textarea.value = node.text;
  textarea.placeholder = "대사를 입력하세요";
  textarea.addEventListener("input", (e) => {
    node.text = e.target.value;
  });

  // 새 선택지 추가 버튼
  const addChildButton = document.createElement("button");
  addChildButton.textContent = "선택지 추가";
  addChildButton.addEventListener("click", () => {
    const newNode = { id: nodeId++, title: "새 분기", text: "", children: [] };
    node.children.push(newNode);
    renderTree(tree, document.getElementById("tree-root"));
  });

  // 노드 삭제 버튼
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "삭제";
  deleteButton.style.color = "red";
  deleteButton.addEventListener("click", () => {
    if (parentNode) {
      parentNode.children = parentNode.children.filter((child) => child.id !== node.id);
      renderTree(tree, document.getElementById("tree-root"));
    } else {
      alert("최상위 노드는 삭제할 수 없습니다!");
    }
  });

  // 하위 선택지 컨테이너
  const childrenContainer = document.createElement("div");
  childrenContainer.className = "children";

  node.children.forEach((child) => {
    const childContainer = document.createElement("div");
    renderTree(child, childContainer, node);
    childrenContainer.appendChild(childContainer);
  });

  nodeElement.appendChild(titleInput);
  nodeElement.appendChild(textarea);
  nodeElement.appendChild(addChildButton);
  nodeElement.appendChild(deleteButton);
  nodeElement.appendChild(childrenContainer);
  container.appendChild(nodeElement);
}

// 내보내기 기능
document.getElementById("export-btn").addEventListener("click", () => {
  const dataStr = JSON.stringify(tree, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "story-tree.json";
  a.click();
});

// 불러오기 기능
document.getElementById("import-file").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      tree = JSON.parse(e.target.result);
      renderTree(tree, document.getElementById("tree-root"));
    };
    reader.readAsText(file);
  }
});

// 초기 렌더링
const rootContainer = document.getElementById("tree-root");
renderTree(tree, rootContainer);
