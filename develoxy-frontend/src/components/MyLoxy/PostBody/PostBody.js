import React from 'react';
import Layer from './Layer';



const mockData = `
리액트를 지난 2년간 사용하면서도 막상 말끔하게 설명하라고 하면 어려웠던 주제, 원래 번역글은 잘 안쓰지만 글 자체가 구성이 잘 되어있어서 글을 번역해보았습니다.

원본: https://hashnode.com/post/the-one-thing-that-no-one-properly-explains-about-react-why-virtual-dom-cisczhfj41bmssp53mvfwmgrq

글의 자연성 및 더 높은 이해도 및 몰입도를 위해 의역이 많이 포함되어 있습니다 🙂
 

어느날 내 친구가 나한테 질문을 했어요: “컴포넌트를 통한 프로젝트 구성, 단방향 데이터 바인딩,  대충 알겠는데.. 왜 Virutal DOM 을 쓰는거야?”

그래서 나는 익숙한 답변을 해줬죠. “음.. 그건 DOM 조작이 비효율적이기 떄문이야. 그리고 또 느리고”

친구가 다시 되묻길, “자바스크립트 엔진은 계속해서 성능이 좋아지고 있는데, 정확히 어떤 부분 때문에 DOM 이 느려지는거야?”

 

… 쩝.

 

좋은 질문이군요! 제가 검색을 좀 해봤는데, 놀랍게도 Virtual DOM 가 왜 정말 필요한지에 대해서 명료하고 이해하기 쉽게 다루는 글은 찾을수가 없었어요.

 

정확히는, DOM 조작이 전체 동작을 비효율적으로 만드는게 아니라, 그 이후에 일어나는 일 때문에, 작업이 더뎌지는거에요.

자, Virtual DOM 을 이해하기 위해서, 잠깐 다른 개념을 좀 다뤄볼게요. 한번 브라우저의 워크플로우가 어떻게 이뤄지는지 살펴보고 DOM 조작 후 어떤일이 일어나는지 대해서 알아볼게요.

 

브라우저의 Workflow

이해를 잘 하기 위해선 브라워저가 어떻게 작동하는지 알아볼 필요가 있어요.

NOTE: 다음 다이아그램과 앞으로 나올 설명은 Webkit 엔진에서 사용하는 용어들을 사용했어요. 작동방식은 대부분의 브라우저에서 비슷합니다. 미묘한 차이가 있을 뿐이에요.

 



 

DOM Tree 생성

브라우저가 HTML 을 전달받으면, 브라우저의 렌더 엔진이 이를 파싱하고 DOM 노드(Node) 로 이뤄진 트리를 만들어요. 각 노드는 각 HTML 엘리먼트들과 연관되어있죠.

 

Render Tree 생성

그리고, 외부 CSS 파일과 각 엘리먼트의 inline 스타일을 파싱해요. 스타일 정보를 사용하여 DOM 트리에 따라 새로운 트리, 렌더트리를 만들어요.

 

Render Tree 생성 – 그 뒤에선 무슨일이 일어나고 있는가..?

Webkit 에서는 노드의 스타일을 처리하는 과정을 ‘attachment’ 라고 불러요. DOM 트리의 모든 노드들은 ‘attach’ 라는 메소드가 있어요. 이 메소드는 스타일 정보를 계산해서 객체형태로 반환합니다.

이 과정은 동기적(synchronous) 작업이구요, DOM 트리에 새로운 노드가 추가되면 그 노드의 attach 메소드가 실행됩니다.

렌더 트리를 만드는 과정에선, 각 요소들의 스타일이 계산되구요, 또 이 계산되는 과정에서 다른 요소들의 스타일 속성들을 참조합니다.

 

Layout (reflow 라고도 불립니다)

렌더 트리가 다 만들어지고 나면, 레이아웃 과정을 거쳐요. 각 노드들은 스크린의 좌표가 주어지고, 정확히 어디에 나타나야 할 지 위치가 주어집니다.

 

Painting

그 다음 작업은 렌더링 된 요소들에 색을 입히는 과정입니다. 트리의 각 노드들을 거쳐가면서 paint() 메소드를 호출해요. 그러고나면, 스크린에 원하는 정보가 나타나는거죠.

 

Virtual DOM 을 만나보세요

자 이제 DOM 을 조작했을 때 어떤 작업이 이뤄지는지 알겠죠? DOM에 변화생기면, 렌더트리를 재생성하고 (그러면 모든 요소들의 스타일이 다시 계산됩니다) 레이아웃을 만들고 페인팅을 하는 과정이 다시 반복되는거죠.

복잡한 SPA(싱글 페이지 어플리케이션) 에서는 DOM 조작이 많이 발생해요. 그 뜻은 그 변화를 적용하기 위해 브라우저가 많이 연산을 해야한단 소리고, 전체적인 프로세스를 비효율적으로 만듭니다.

자, 이 이부분에서 Virtual DOM 이 빛을 발합니다! 만약에 뷰에 변화가 있다면, 그 변화는 실제 DOM 에 적용되기전에 가상의 DOM 에 먼저 적용시키고 그 최종적인 결과를 실제 DOM 으로 전달해줍니다. 이로써, 브라우저 내에서 발생하는 연산의 양을 줄이면서 성능이 개선되는 것 이지요.

 

업데이트: ugwe43to874nf4 라는 레딧유저님이 Virtual DOM 의 중요성을 더 알려주었습니다.

DOM 조작의 실제 문제는 각 조작이 레이아웃 변화, 트리 변화와 렌더링을 일으킨다는겁니다. 그래서, 예를 들어 여러분이 30개의 노드를 하나 하나 수정하면, 그 뜻은 30번의 (잠재적인) 레이아웃 재계산과 30번의 (잠재적인) 리렌더링을 초래한다는 것이죠.

Virtual DOM 은 그냥 뭐 엄청 새로운것도 아니고, 그냥 DOM 차원에서의 더블 버퍼링이랑 다름이 없는거에요. 변화가 일어나면 그걸 오프라인 DOM 트리에 적용시키죠. 이 DOM 트리는 렌더링도 되지 않기때문에 연산 비용이 적어요. 연산이 끝나고나면 그 최종적인 변화를 실제 DOM 에 던져주는거에요. 딱 한번만 한는거에요. 모든 변화를 하나로 묶어서. 그러면, 레이아웃 계산과 리렌더링의 규모는 커지겠지만, 다시 한번 강조하자면 딱 한번만 하는거에요. 바로 이렇게, 하나로 묶어서 적용시키는것이, 연산의 횟수를 줄이는거구요.

사실, 이 과정은 Virtual DOM 이 없이도 이뤄질수 있어요. 그냥, 변화가 있을 때, 그 변화를 묶어서 DOM fragment 에 적용한 다음에 기존 DOM 에 던져주면 돼요.

그러면, Virtual DOM 이 해결 하려고 하는건 무엇이냐? 그 DOM fragment를 관리하는 과정을 수동으로 하나하나 작업 할 필요 없이, 자동화하고 추상화하는거에요. 그 뿐만 아니라, 만약에 이 작업을 여러분들이 직접 한다면, 기존 값 중 어떤게 바뀌었고 어떤게 바뀌지 않았는지 계속 파악하고 있어야하는데 (그렇지 않으면 수정 할 필요가 없는 DOM 트리도 업데이트를 하게 될 수도 있으니까요), 이것도 Virtual DOM 이 이걸 자동으로 해주는거에요. 어떤게 바뀌었는지 , 어떤게 바뀌지 않았는지 알아내주죠.

마지막으로, DOM 관리를 Virtual DOM 이 하도록 함으로써, 컴포넌트가 DOM 조작 요청을 할 때 다른 컴포넌트들과 상호작용을 하지 않아도 되고, 특정 DOM 을 조작할 것 이라던지, 이미 조작했다던지에 대한 정보를 공유 할 필요가 없습니다. 즉, 각 변화들의 동기화 작업을 거치지 않으면서도 모든 작업을 하나로 묶어줄 수 있다는거죠.

 

더 읽어보기

여기서 서술한 브라우저 작동방식에 대한 정보는 여기서 발췌했습니다. 브라우저의 작동방식에 대해서 더 깊게 다루는 포스트에요. 읽어볼만한 가치가 있습니다. 제가 Virtual DOM 의 필요성을 이해하게 해주는데 큰 도움이 되었어요.

– 포스트 끝 –

추가 내용

리액트 입문자들 중에서 일부 사람들이 오해하고 있는것이, 리액트 = 빠르다! 인데, 이는 잘못된 인식입니다.

한번 Redux 창시자이자 React 개발팀원인 Dan Abramov 의 트윗을 한번 읽어볼까요?



정말 명료한 말입니다.

번역: React가 DOM 보다 빠르다는건 잘못된 사실이에요. 사실은: 유지보수 가능한 어플리케이션을 만드는것을 도와주고 그리고 대부분의 경우에 ‘충분히 빠르다’

 

충분히 빠르기에 또 페이스북에서 쓰는거구요.

 

최적화 작업을 (제대로) 손수했을때와 리액트를 사용 했을때를 비교한다면 대부분의 경우 전자가 더 빠릅니다.

하지만 이를 자동화해주는 리액트를 사용 했을 땐 생산성이 배가되겠죠?

 

추가적으로, 리액트를 사용한다고해도 최적화작업이 제대로 이뤄지지 않으면 오히려 엄청~~나게 구린 퍼포먼스를 나타낼수도 있다는 것, 꼭 알아두세요~
`
const PostBody = ({darken}) => {
    return (
        <div className="post-body">
            <Layer visible={darken}/>
            <div className="inner">
                <h1>[번역] 리액트에 대해서 그 누구도 제대로 설명하기 어려운 것 – 왜 Virtual DOM 인가?</h1>
                <div className="content">
                    {mockData}
                </div>
            </div>
        </div>
    );
};

export default PostBody;