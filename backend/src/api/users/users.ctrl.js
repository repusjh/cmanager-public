import User from '../../models/user';

//유저 목록을 불러옴
export const list = async ctx => {
  try {
    //최신 순으로 정렬
    const users = await User.find()
      .sort({ _id: -1 })
      .exec();
    //hashed password가 노출되지 않도록 수정 후 리턴
    let newUsers = JSON.parse(JSON.stringify(users));
    newUsers.map(user => {
      delete user.hashedPassword;
    });

    ctx.body = newUsers;
  } catch (e) {
    ctx.throw(500, e);
  }
};

//유저 정보를 변경
export const update = async ctx => {
  //=============확인 필요==============
  const { _id } = ctx.request.body;
  try {
    const user = await User.findByIdAndUpdate(_id, ctx.request.body, {
      //변경된 결과를 반환하는 옵션
      new: true,
    }).exec();
    //해당 id를 가진 유저가 존재하지 않는다면
    if (!user) {
      ctx.status = 404; //not found
      return;
    }
    //변경된 정보를 ctx.body로 설정
    ctx.body = user;
  } catch (e) {
    ctx.throw(500, e);
  }
};

//유저 삭제
export const remove = async ctx => {
  const { _id } = ctx.request.body;
  try {
    await User.findByIdAndRemove(_id).exec();
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};
