import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
//import TableFooter from '@material-ui/core/TableFooter';
import Pagination from '@material-ui/lab/Pagination';
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

import CreateIcon from '@material-ui/icons/Create';
//import { withStyles } from "@material-ui/core/styles";

import { dateFormatter } from '../utils';
// import globalStore from '../store/store';
import { getBoardList, setBoardList } from '../modules/board';
import BoardService from '../services/board-service';
import { Board as BoardModel } from '../model/board';

// import PPTLogo from '../../public/images/PowerPointLogo';
import { useAppDispatch, useAppSelector } from '../hooks';
import { selectUserName } from '../modules/user';

function Board() {
	const height = 30;
	const navigate = useNavigate();
	const boardList = useAppSelector(getBoardList);
	const userName = useAppSelector(selectUserName);
	const dispatch = useAppDispatch();

	const routeChange = (url: string, data?: any) => {
		navigate(url, { state: data });
	}

	function onClickItem(data: any) {
		if (userName === "") {
			alert("로그인 후 이용가능합니다.");
			return;
		}
		const num = data.num;
		if (num) {
			routeChange(`/board_content?num=${num}`, data);
		} else {
			alert('상품 번호가 존재하지 않습니다.');
		}
	}

	async function loadBoardList() {
		const boardService = new BoardService();
		const result: BoardModel[] = await boardService.find();

		if (result) {
			result.sort((a: BoardModel, b: BoardModel) => {
				if (a.date && b.date) {
					const aDate = new Date(a.date).getTime();
					const bDate = new Date(b.date).getTime();
					return bDate - aDate;
				}
				return 0;
			});
			dispatch(setBoardList(result));
		}
	}

	useEffect(() => {
		loadBoardList();
	}, []);

	return (
		<div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
			<div style={{ width: '90%' }}>
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>번호</TableCell>
								<TableCell>파일</TableCell>
								<TableCell>제목</TableCell>
								<TableCell>작성자</TableCell>
								<TableCell>날짜</TableCell>
								<TableCell>조회수</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{boardList.map((data, i) => (
								<TableRow style={{ cursor: 'pointer' }} key={i} onClick={() => onClickItem(data)}>
									<TableCell>{data.num}</TableCell>
									<TableCell>{data.file && <img src="images/PowerPointLogo.png" alt=" " width="50px" height="50px" />}</TableCell>
									<TableCell>{data.title}</TableCell>
									<TableCell>{data.userinfo[0].name}</TableCell>
									<TableCell>{data.date && dateFormatter(data.date)}</TableCell>
									<TableCell>{data.count}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
				<Box m={2} />
				<Box display="flex" justifyContent="space-between">
					<Box m={1} />
					<Box>
						<Pagination count={11} defaultPage={1} siblingCount={0} variant="outlined" color="primary" />
					</Box>
					<Box display="flex">
						{userName !== '' &&
							<Button variant="outlined" color="primary" size="small" startIcon={<CreateIcon />} onClick={() => routeChange('/board_write')}>
								글쓰기
							</Button>
						}
						<Box m={1} />
					</Box>
				</Box>
				<Box m={2} />
				<Box display="flex" flexDirection="row" justifyContent="center" height="30px">
					<TextField variant="outlined" rows={1} placeholder="검색어를 입력해주세요" InputProps={{ style: { height, padding: '0 14px' } }} />
					<Box m={1} />
					<Button variant="outlined" color="primary" size="small">검색</Button>
				</Box>
			</div>
		</div>
	);
}

export default Board;